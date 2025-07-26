// Variables globales   
let ciudadInput = document.getElementById("ciudadInput");
let buscarClimaBtn = document.getElementById("buscarClimaBtn");
let resultadoClima = document.getElementById("resultadoClima");

// API KEY
const OPENWEATHER_API_KEY = "81b1d3abdb17eb46a7f9ea984f402277";

// Evento al botón de buscar clima
if (buscarClimaBtn) {
    buscarClimaBtn.addEventListener("click", () => {
        const ciudad = ciudadInput.value.trim();
        if (ciudad) {
            obtenerClima(ciudad);
        } else {
            resultadoClima.innerHTML = '<p class="text-danger">Por favor, introduce el nombre de una ciudad.</p>';
        }
    });
} else {
    console.error("El botón con el id 'buscarClimaBtn' no se encontró en el DOM.");
}

// Función para obtener el clima de una ciudad
async function obtenerClima(ciudad) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;

    resultadoClima.innerHTML = '<p>Buscando clima... 🙂</p>';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Ciudad no encontrada. Por favor, verifica el nombre.");
            }
            throw new Error(`Error al obtener el clima: ${response.statusText}`);
        }

        const data = await response.json();

        // Mostrar la información del clima
        resultadoClima.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Clima en ${data.name}, ${data.sys.country}</h5>
                    <p class="card-text">Temperatura: ${data.main.temp}°C</p>
                    <p class="card-text">Sensación térmica: ${data.main.feels_like}°C</p>
                    <p class="card-text">Descripción: ${data.weather[0].description}</p>
                    <p class="card-text">Humedad: ${data.main.humidity}%</p>
                    <p class="card-text">Viento: ${data.wind.speed} m/s</p>
                    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Icono del clima">
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error al obtener el clima:", error);
        resultadoClima.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
}