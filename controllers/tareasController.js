const Tareas = require('../modles/Tareas');
const Proyectos = require('../modles/Proyectos');

exports.agregarTarea = async (req, res, next) => {
    // Obtenemos proyecto actual
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });
    const proyectosPromise = Proyectos.findAll();

    const [proyecto, proyectos] = await Promise.all([proyectoPromise, proyectosPromise]);
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            {model: Proyectos}
        ]
    });

    // Validar contenido del input
    const {tarea} = req.body;
    const estado = 0;
    const proyectoId = proyecto.id;

    let errores = [];

    if (!tarea) {
        errores.push({'texto': 'Agregar un nombre a tarea'});
    }

    if (errores.length > 0) {
        res.render(`tareas`, {
            nombrePagina: 'Tareas Del Proyecto',
            errores,
            proyectos,
            proyecto,
            tareas
        });
    } else {
        // Insertar a base de datos
        const resultado = await Tareas.create({tarea, estado, proyectoId})
        // Redireccionar
        if (!resultado) {
            return next();
        }
        res.redirect(`/proyectos/${req.params.url}`);
    }


}

exports.cambiarEstadoTarea = async (req, res) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id: id
        }
    });
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();
    if (!resultado) return next();
    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res, next) => {
    const {id} = req.params;
    const resultado = await Tareas.destroy({
        where: {
            id: id
        }
    });
    if (!resultado) return next();
    res.status(200).send('Tarea Eliminada Correctamente');
}