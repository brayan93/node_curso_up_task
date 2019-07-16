import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');
if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        // console.log(url);
        Swal.fire({
            title: 'Desea borrar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                
                axios.delete(url, {
                    params: {urlProyecto}
                }).then(function (resp) {
                    // Enviar peticion a axios
                    console.log(resp);
                    Swal.fire(
                        'Proyecto eliminado!',
                        resp.data,
                        'success'
                    ).then(function(resp) {
                        window.location.href = '/';
                    });
                    // Redireccionar al inicio
                    // setTimeout(() => {
                    // }, 3000);
                }).catch(function() {
                    Swal.fire({
                        type: 'error',
                        title: 'Ocurrio un error',
                        text: 'No se pudo eliminar proyecto'
                    })
                });
            }
        })
    });
}
export default btnEliminar;