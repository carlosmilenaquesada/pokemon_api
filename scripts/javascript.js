
window.addEventListener('load', () => {

    const listaPokemon = document.getElementById('listaPokemon');
    const tipoPokemon = document.getElementById('tipoPokemon');
    const botonesHeader = document.querySelectorAll('.button__nav');

    var detener = true;

    let indice = 1;

    let URL = "http://pokeapi.co/api/v2/pokemon/";

    botonesHeader.forEach(function (boton) {
        boton.addEventListener("click", function () {
            if (detener === true) {
                detener = false;
                listaPokemon.innerHTML = "";

                const botonType = boton.id;

                tipoPokemon.innerHTML = botonType;

                buscarPokemon(botonType);
            }
        });

    });

    function mostrarPokemon(poke) {

        var cantidadMostrada = document.querySelectorAll('.pokemon').length;

        if (cantidadMostrada <= 9) {

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
            console.log(cantidadMostrada);
        }
        
        /*if (document.querySelectorAll('.pokemon').length < 10) {
        }*/


    }




    async function buscarPokemon(tipoPoke) {

        for (let i = indice; i <= 1010 && detener === false; i++) {

            await fetch(URL + i).then(function (response) {

                response.json().then(function (poke) {
                    if (tipoPoke === "all") {
                        mostrarPokemon(poke);
                    } else {
                        const tipos = poke.types.map(type => type.type.name);
                        if (tipos.some(tipo => tipo.includes(tipoPoke))) {
                            mostrarPokemon(poke);
                        }

                    };
                });
            });
        }

        detener = true;


    };
});