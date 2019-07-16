const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al model para autenticar
const Usuario = require('../modles/Usuarios');

// local strategy
passport.use(
    new LocalStrategy(
        // por defecto passport espera un usuario y pass
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuario.findOne({
                    where: {email, activo: 1}
                });
                // Usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    });
                }
                // Email y contraseña correctas
                return done(null, usuario);
            } catch (error) {
                // Usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                });
            }
        }
    )
);

// Serializar
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
});
// Deserliazar
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
});
// exportar
module.exports = passport;