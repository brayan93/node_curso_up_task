import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';
const tareas = document.querySelector('.listado-pendientes');
if (tareas) {
    tareas.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-check-circle')) {
            // ID TAREA
            const icono = e.target; 
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            // REQUEST HACIA LA RUTA TAREA
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, {idTarea}).then(function(resp) {
                console.log('all nice');
                if (resp.status === 200) {
                    icono.classList.toggle('completo')
                    actualizarAvance();
                }
            }).catch(function(err) {
                Swal.fire({
                    type: 'error',
                    title: 'Ocurrio un error',
                    text: 'No se puedo cambiar el estado de la tarea'
                });
            });
        }

        if (e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            Swal.fire({
                title: 'Desea borrar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.value) {
                    // enviar delete por medio de axio
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, {params: {
                        idTarea
                    }}).then(function(resp) {
                        if (resp.status === 200) {
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            actualizarAvance();
                        }
                    })
                }
            });
        }
    });
}

export default tareas;