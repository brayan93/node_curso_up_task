const express = require('express');
const routes = require("./routes/index");
const path = require('path');
const bodyparse = require('body-parser');
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('./config/passport');


const flash = require('connect-flash');

// HELPERS
const helpers = require('./helpers');

// Crear conexion a la base de datos

const db = require('./config/db');
// Importar modelo

require('./modles/Proyectos');
require('./modles/Tareas');
require('./modles/Usuarios');

db.sync()
    .then(() => console.log('Contectado al Server'))
    .catch(() => console.log('Error al conectar con el Server'))

// Crear app express
const app = express();

// Habilitar pug
app.set('view engine', 'pug');

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Habilitar body-parser para leer info de los formularios
app.use(bodyparse.urlencoded({extended: true}));

// cargar archivos estaticos
app.use(express.static('public'));

// agrega flash messages
app.use(flash());

app.use(cookie());
// sessiones nos permiter navegar entre paginas sin volver a autenicar
app.use(session({
    secret: 'secretosuper',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

app.listen(3002);

// require('./handlers/email');
