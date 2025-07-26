//variables globales
let boton = document.querySelector(".btn-consultar");
let resultado = document.querySelector(".resultado");

//evento al boton
if (boton) {
    boton.addEventListener("click", () => {
        resultado.innerHTML = '';
        peticionGaleriaFotos();
    });
} else {
    console.error("El botón con la clase 'btn-consultar' no se encontró en el DOM.");
}

// Función peticion API
async function peticionGaleriaFotos() {
    let url = "https://jsonplaceholder.typicode.com/photos?_limit=10";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fotos = await response.json();

        fotos.forEach((foto) => {
            resultado.innerHTML += `
                <div class="card" style="width: 18rem; margin: 10px; display: inline-block;">
                    <img src="${foto.thumbnailUrl}" class="card-img-top" alt="${foto.title}">
                    <div class="card-body">
                        <h5 class="card-title">${foto.title}</h5>
                        <p class="card-text">ID: ${foto.id}</p>
                        <a href="${foto.url}" target="_blank" class="btn btn-primary">Ver Imagen Completa</a>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error al obtener las fotos:", error);
        resultado.innerHTML = `<p>Ocurrió un error al cargar las imágenes. Por favor, inténtalo de nuevo.</p>`;
    }
}