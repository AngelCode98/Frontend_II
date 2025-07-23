// variables globales
const d = document;
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let imagenPro = d.querySelector("#imagenPro");
let descripcionPro = d.querySelector("#descripcionPro");
let btnGuardar = d.querySelector(".btnGuardar");
let btnActualizar = d.querySelector(".btnActualizar");
let tabla = d.querySelector(".table > tbody");
let buscador = d.querySelector("#buscador");
let exportarPdfBtn = d.querySelector("#exportarPdf");

let editIndex = -1; // Para llevar un registro del índice del producto que se está editando

// Event Listeners
btnGuardar.addEventListener("click", () => {
    ValidarDatos();
});

btnActualizar.addEventListener("click", () => {
    actualizarProducto();
});

d.addEventListener("DOMContentLoaded", () => {
    mostrarDatos();
});

buscador.addEventListener("keyup", () => {
    buscarProductos(buscador.value);
});

exportarPdfBtn.addEventListener("click", () => {
    exportarAPdf();
});

// --- Funciones CRUD ---

// Función para validar y guardar/actualizar datos
function ValidarDatos() {
    if (nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value) {
        const producto = {
            nombre: nombrePro.value,
            precio: parseFloat(precioPro.value),
            imagen: imagenPro.value,
            descripcion: descripcionPro.value
        };

        if (editIndex === -1) {
            guardarDatos(producto);
            alert("Producto guardado con éxito.");
        } else {
            // Esto se manejará en la función actualizarProducto, pero la validación es la misma
        }
        limpiarFormulario();
        mostrarDatos();
    } else {
        alert("Todos los campos son obligatorios.");
    }
}

// Función para guardar datos en localStorage
function guardarDatos(pro) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(pro);
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Función para mostrar los datos guardados en localStorage
function mostrarDatos(productosFiltrados = null) {
    tabla.innerHTML = ""; // Limpiar la tabla antes de mostrar
    let productos = productosFiltrados || JSON.parse(localStorage.getItem("productos")) || [];

    if (productos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="6" class="text-center">No hay productos para mostrar.</td></tr>`;
        return;
    }

    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td>
                <img src="${producto.imagen}" width="50px" height="50px" style="object-fit: cover;">
            </td>
            <td>
                <button class="btn btn-info btn-sm me-2 btnEditar" data-index="${i}">Editar</button>
                <button class="btn btn-danger btn-sm btnEliminar" data-index="${i}">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
    agregarEventListenersBotones();
}

// Función para agregar EventListeners a los botones de editar y eliminar
function agregarEventListenersBotones() {
    d.querySelectorAll(".btnEditar").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            cargarParaEdicion(index);
        });
    });

    d.querySelectorAll(".btnEliminar").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            eliminarProducto(index);
        });
    });
}

// Función para cargar datos en el formulario para edición
function cargarParaEdicion(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos[index];

    if (producto) {
        nombrePro.value = producto.nombre;
        precioPro.value = producto.precio;
        imagenPro.value = producto.imagen;
        descripcionPro.value = producto.descripcion;

        btnGuardar.style.display = "none";
        btnActualizar.style.display = "block";
        editIndex = index;
    }
}

// Función para actualizar un producto
function actualizarProducto() {
    if (editIndex !== -1 && nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value) {
        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos[editIndex] = {
            nombre: nombrePro.value,
            precio: parseFloat(precioPro.value),
            imagen: imagenPro.value,
            descripcion: descripcionPro.value
        };
        localStorage.setItem("productos", JSON.stringify(productos));
        alert("Producto actualizado con éxito.");
        limpiarFormulario();
        btnGuardar.style.display = "block";
        btnActualizar.style.display = "none";
        editIndex = -1;
        mostrarDatos();
    } else {
        alert("Por favor, complete todos los campos para actualizar o seleccione un producto para editar.");
    }
}

// Función para eliminar un producto
function eliminarProducto(index) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.splice(index, 1); // Elimina 1 elemento en la posición 'index'
        localStorage.setItem("productos", JSON.stringify(productos));
        alert("Producto eliminado con éxito.");
        mostrarDatos();
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    nombrePro.value = "";
    precioPro.value = "";
    imagenPro.value = "";
    descripcionPro.value = "";
}

// --- Funcionalidad del Buscador ---
function buscarProductos(terminoBusqueda) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const terminoLower = terminoBusqueda.toLowerCase();

    const productosEncontrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.descripcion.toLowerCase().includes(terminoLower)
    );
    mostrarDatos(productosEncontrados);
}

// --- Funcionalidad de Exportar a PDF ---
async function exportarAPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Listado de Productos", 10, 10);
    
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    let y = 30; // Posición inicial para el contenido

    if (productos.length === 0) {
        doc.text("No hay productos para exportar.", 10, y);
    } else {
        // Encabezados de la tabla
        doc.setFontSize(10);
        doc.text("Nombre", 10, y);
        doc.text("Precio", 60, y);
        doc.text("Descripción", 90, y);
        doc.text("Imagen (URL)", 150, y);
        y += 7; // Espacio después de los encabezados

        productos.forEach(producto => {
            doc.setFontSize(8);
            doc.text(producto.nombre, 10, y);
            doc.text(`$${producto.precio.toFixed(2)}`, 60, y);
            doc.text(doc.splitTextToSize(producto.descripcion, 50), 90, y); // Limita el ancho de la descripción
            doc.text(doc.splitTextToSize(producto.imagen, 50), 150, y); // Limita el ancho de la URL de la imagen
            y += 10; // Espacio entre cada fila de producto

            if (y > 280) { // Si llega al final de la página, añade una nueva página
                doc.addPage();
                y = 10; // Reinicia la posición Y
                doc.setFontSize(10);
                doc.text("Listado de Productos (Continuación)", 10, 10);
                doc.text("Nombre", 10, 20);
                doc.text("Precio", 60, 20);
                doc.text("Descripción", 90, 20);
                doc.text("Imagen (URL)", 150, 20);
                y = 27;
            }
        });
    }

    doc.save("listado_productos.pdf");
}