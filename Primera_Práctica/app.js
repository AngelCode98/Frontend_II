// Seleccionar los elementos HMTL.
const input = document.getElementById('ingresar-tarea');
const boton = document.querySelector('button');
const listaDeTareas = document.getElementById('lista-de-tareas');

boton.addEventListener('click', agregarTarea);
input.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        agregarTarea();
    }
});

// Crear y agreagar una tarea a la lista de tareas
// en el DOM.
function agregarTarea() {
    if (input.value) {
        // Crear tarea.
        let tareaNueva = document.createElement('div');
        tareaNueva.classList.add('tarea');

        // Texto ingresado por el usuario.
        let texto = document.createElement('p');
        texto.innerText = input.value;
        tareaNueva.appendChild(texto);

        // Crear y agregar contenedor de los iconos
        let iconos = document.createElement('div');
        iconos.classList.add('iconos');
        tareaNueva.appendChild(iconos);

        // Crear y agregar iconos.
        let completar = document.createElement('i');
        completar.classList.add('bi', 'bi-check-circle-fill', 'icono-completar');
        completar.addEventListener('click', completarTarea);

        let editar = document.createElement('i');
        editar.classList.add('bi', 'bi-pencil-fill', 'icono-editar');
        editar.addEventListener('click', editarTarea); // Asignar el listener aquí

        let eliminar = document.createElement('i');
        eliminar.classList.add('bi', 'bi-trash3-fill', 'icono-eliminar');
        eliminar.addEventListener('click', eliminarTarea);

        iconos.append(completar, editar, eliminar);

        // Agregar la tarea a la lista.
        listaDeTareas.appendChild(tareaNueva);
        input.value = ''; // Limpiar el input
    } else {
        alert('Por favor ingresa una tarea.');
    }
}

// Marcar una tarea como completada.
function completarTarea(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.classList.toggle('completada');
}

function editarTarea(e) {
    let tareaDiv = e.target.parentNode.parentNode;
    let parrafoTexto = tareaDiv.querySelector('p');

    // Si ya hay un input de edición, no hacer nada (evita múltiples inputs)
    if (tareaDiv.querySelector('input[type="text"]')) {
        return;
    }

    let inputEdicion = document.createElement('input');
    inputEdicion.type = 'text';
    inputEdicion.value = parrafoTexto.innerText;
    inputEdicion.classList.add('input-editar'); // Para estilos CSS

    // Reemplazar el párrafo con el input
    tareaDiv.replaceChild(inputEdicion, parrafoTexto);
    inputEdicion.focus();
    inputEdicion.select();

    // Función para guardar la edición
    const guardarEdicion = () => {
        if (inputEdicion.value.trim() === '') { // Evitar tareas vacías
            alert('La tarea no puede estar vacía. Se restaurará el texto original.');
            parrafoTexto.innerText = parrafoTexto.innerText; // Restaurar texto original si se borró
        } else {
            parrafoTexto.innerText = inputEdicion.value; // Actualizar el texto del párrafo
        }
        tareaDiv.replaceChild(parrafoTexto, inputEdicion); // Volver a poner el párrafo
    };

    // Escuchar Enter y blur para guardar la edición
    inputEdicion.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            guardarEdicion();
        }
    });

    inputEdicion.addEventListener('blur', guardarEdicion); // Cuando el input pierde el foco
}

// Eliminar una tarea del DOM.
function eliminarTarea(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.remove();
}