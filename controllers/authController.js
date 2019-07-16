const passport = require('passport');
const Usuarios = require('../modles/Usuarios');

const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});
// Revisar si el usuario esta logueado
exports.usuarioAutenticado = (req, res, next) => {
    // Si esta logueado next
    if (req.isAuthenticated()) {
        return next();
    }
    // Retornar al inicio
    return res.redirect('/iniciar-sesion');
}

// Cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

// generar token
exports.enviarToken = async (req, res) => {
    // Verificar usuario
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email
        }
    });
    // Si noe xiste
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer', {
            nombrePagina: 'Recuperar contraseña',
            mensajes: req.flash()
        })
    }

    // existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    // expiracion token
    usuario.expiracion = Date.now() + 3600000;
    // Guardar en la base de datos
    await usuario.save();
    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'resetPassword'
    });
    req.flash('correcto', 'Se envio un mensaje a su correo con el link para recuperar su contraseña');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const {token} = req.params;
    const usuario = await Usuarios.findOne({
        where: {token}
    });
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }
    //  Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Recuperar Contraseña'
    });
}

// Cambiar contraseña
exports.resetPassword = async (req, res) => {
    // verifica token y fecha de expiracion
    const {token} = req.params;
    const {password} = req.body;
    const usuario = await Usuarios.findOne({
        where: {
            token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // verificar si existe
    console.log(usuario);
    if (!usuario) {
        req.flash('errpr', 'No valido');
        res.redirect('/reestablecer');
    }
    usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    // Guardamos cambios
    await usuario.save();
    req.flash('correcto', 'Se ha recupera la contraseña correctamente');
    res.redirect('/iniciar-sesion');
}