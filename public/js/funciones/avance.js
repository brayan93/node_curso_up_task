import Swal from "sweetalert2";

export const actualizarAvance = () => {
    // seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length) {
        // seleccionar las completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');
        // calcular el avance
        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
        console.log(avance);
        // mostrar avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        if (avance === 100) {
            Swal.fire(
                'Completaste el proyecto',
                'Felicidades, has terminado tus tareas',
                'success'
            )
        }
    } else {
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = '0%';

    }
}