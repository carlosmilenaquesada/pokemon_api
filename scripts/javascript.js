

const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".button__nav");
let URL = "http://pokeapi.co/api/v2/pokemon/";



function mostrarPokemon(poke) {

    let tipos = poke.types.map(function (type) {
        return `<p class="${type.type.name} tipo">${type.type.name}</p>`;
    });

    tipos = tipos.join();

    let pokeId = String(poke.id).padStart(3, "0");

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `<p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${pokeId}</p>
            <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
        <div class="pokemon-tipos">
        ${tipos}
        </div>
        <div class="pokemon-stats">
            <p class=stat">${poke.height}</p>
            <p class="stat">${poke.weight}</p>
        </div>
    </div>`;
    listaPokemon.append(div);
}

botonesHeader.forEach(function (boton) {
    boton.addEventListener("click", async function (event) {
        const botonId = event.currentTarget.id;

        listaPokemon.innerHTML = "";

        for (let i = 1; i <= 151; i++) {
           await fetch(URL + i).then(function (response) {
                return response.json();
            }).then(function (poke) {
                if (botonId !== "all") {
                    const tipos = poke.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(poke);
                    }
                } else {
                    mostrarPokemon(poke);
                }

            });
        }
    });
});
