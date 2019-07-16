const Proyectos = require('../modles/Proyectos');
const Tareas = require('../modles/Tareas');

exports.proyectosHome = async (req, res) => {
    // console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}
exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    // Enviar a la consola lo que el usuaruo ingrese
    // console.log(req.body);

    // Validar contenido del input
    const {nombre} = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agregar un nombre al proyecto'});
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No se tiene errores
        // Insertar en la DB;
        const usuarioId = res.locals.usuario.id;
        const proyecto = await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const url = req.params.url;
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            {model: Proyectos}
        ]
    });
    if (!proyecto) {
        return next();
    }
    // Render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    });
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = await Proyectos.findAll({
        where: {
            usuarioId
        }
    });
    const id = req.params.id;
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    // Enviar a la consola lo que el usuaruo ingrese
    // console.log(req.body);

    // Validar contenido del input
    const {nombre} = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agregar un nombre al proyecto'});
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No se tiene errores
        // Insertar en la DB;
        await Proyectos.update({
            nombre: nombre
        }, {
            where: {
                id: req.params.id
            }
        });
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params
    // console.log(req.query);
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    });

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}