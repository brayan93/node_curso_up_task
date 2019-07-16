const Usuarios = require('../modles/Usuarios');
const enviarEmail = require('../handlers/email');
exports.crearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta'
    });
}
exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en Uptask',
        error
    });
}
exports.crearCuentaDB = async (req, res) => {
    // Leer los datos
    const {email, password} = req.body;
    try {
        // Crear usuario
        await Usuarios.create({
            email,
            password
        })
        // crear una URL de confimar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;  
        // crear el objecto usuario
        const usuario = {
            email
        }
        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Uptask',
            confirmarUrl,
            archivo: 'confirmarCuenta'
        });
        // redirigir al usuario
        req.flash('correcto', 'Enviamos a su correo el link para confirmar su cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        console.log(error);
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            nombrePagina: 'Crear Cuenta en Uptask',
            mensajes: req.flash(),
            email,
            password
        })
    }
}


exports.formRestableceerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Recuperar contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    const {correo} = req.params;
    const usuario = await Usuarios.findOne({
        where: {email: correo}
    });

    // si no existe
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Se ha confirmado su cuenta');
    res.redirect('/iniciar-sesion');
}