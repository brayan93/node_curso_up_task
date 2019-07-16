const express = require('express');
const routes = express.Router();

// Importar express-validator
const { body } = require('express-validator/check')

// Importar el controlador
const proyectosController = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')

module.exports = function() {
    routes.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome);
    routes.get('/nuevoProyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto);
    
    routes.post(
        '/nuevoProyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );
    // Listar Proyecto
    routes.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl);
    // Actualizar Proyecto
    routes.get('/proyectos/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar);
    // Modificar
    routes.post(
        '/nuevoProyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );
    // eliminar
    routes.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto);
    
    // Tareas
    routes.post(
        '/proyectos/:url',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        tareasController.agregarTarea
    );
    // Cambiar estado tarea
    routes.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);
    // eliminar tarea
    routes.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);
    // Crear nueva cuenta
    routes.get('/crear-cuenta', usuariosController.crearCuenta);
    // Crear nueva cuenta
    routes.post('/crear-cuenta', usuariosController.crearCuentaDB);
    routes.get('/confirmar/:correo', usuariosController.confirmarCuenta);
    // Iniciar sesion
    routes.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    routes.post('/iniciar-sesion', authController.autenticarUsuario);
    
    // cerrar sesion
    routes.get('/cerrar-sesion', authController.cerrarSesion);
    // rest password
    routes.get('/reestablecer', usuariosController.formRestableceerPassword);
    routes.post('/reestablecer', authController.enviarToken);
    routes.get('/reestablecer/:token', authController.validarToken);
    routes.post('/reestablecer/:token', authController.resetPassword);


    return routes;
}