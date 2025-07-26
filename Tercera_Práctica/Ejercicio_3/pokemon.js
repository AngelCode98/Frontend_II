// Variables globales
let pokemonInput = document.getElementById("pokemonInput");
let buscarPokemonBtn = document.getElementById("buscarPokemonBtn");
let resultadoPokemon = document.getElementById("resultadoPokemon");

// Evento al botón de buscar Pokémon
if (buscarPokemonBtn) {
    buscarPokemonBtn.addEventListener("click", () => {
        const pokemonNombreOId = pokemonInput.value.toLowerCase().trim();
        if (pokemonNombreOId) {
            obtenerPokemon(pokemonNombreOId);
        } else {
            resultadoPokemon.innerHTML = '<p class="text-danger">Por favor, introduce el nombre o ID de un Pokémon.</p>';
        }
    });
} else {
    console.error("El botón con el id 'buscarPokemonBtn' no se encontró en el DOM.");
}

// Función para obtener la información de un Pokémon
async function obtenerPokemon(nombreOId) {
    let url = `https://pokeapi.co/api/v2/pokemon/${nombreOId}/`;

    resultadoPokemon.innerHTML = '<p>Buscando Pokémon...</p>';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Pokémon no encontrado. Verifica el nombre o ID.");
            }
            throw new Error(`Error al obtener el Pokémon: ${response.statusText}`);
        }

        const data = await response.json();

        // Extraer habilidades
        const habilidades = data.abilities.map(ability => ability.ability.name).join(', ');

        // Extraer tipos
        const tipos = data.types.map(type => type.type.name).join(', ');

        // Extraer movimientos (ejemplo, solo los primeros 5)
        const movimientos = data.moves.slice(0, 5).map(move => move.move.name).join(', ');

        // Mostrar la información del Pokémon
        resultadoPokemon.innerHTML = `
            <div class="card text-center" style="width: 22rem; margin: 0 auto;">
                <img src="${data.sprites.front_default}" class="card-img-top pokemon-image" alt="${data.name}">
                <div class="card-body">
                    <h5 class="card-title">${data.name.charAt(0).toUpperCase() + data.name.slice(1)} (#${data.id})</h5>
                    <p class="card-text"><strong>Tipo(s):</strong> ${tipos}</p>
                    <p class="card-text"><strong>Altura:</strong> ${data.height / 10} m</p>
                    <p class="card-text"><strong>Peso:</strong> ${data.weight / 10} kg</p>
                    <p class="card-text"><strong>Habilidades:</strong> ${habilidades}</p>
                    <p class="card-text"><strong>Algunos movimientos:</strong> ${movimientos || 'N/A'}</p>
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error al obtener el Pokémon:", error);
        resultadoPokemon.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
}