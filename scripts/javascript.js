
window.addEventListener('load', () => {

    const listaPokemon = document.getElementById('listaPokemon');
    const tipoPokemon = document.getElementById('tipoPokemon');
    const botonesHeader = document.querySelectorAll('.button__nav');

    let url = "http://pokeapi.co/api/v2/";


    let tipoActual = "";

    let usandose = false;
    let cantidadMostrada = 0;

    let cantTotalPokemon = 0;

    fetch(url + "pokemon-species").then(function (response) {
        return response.json();
    }).then(async function (data) {
        cantTotalPokemon = data.count;
        buscarPokemon("all");

        botonesHeader.forEach(function (boton) {
            boton.addEventListener("click", function () {

                if (usandose === false) {
                    usandose = true;
                    const botonType = boton.id;

                    tipoPokemon.innerHTML = botonType;
                    tipoActual = botonType;
                    listaPokemon.innerHTML = "";
                    cantidadMostrada = 0;

                    buscarPokemon(botonType);
                }

            });
        });



    }).catch(function (error) {
        console.log("ocurrió un error: " + error);
    });

    async function buscarPokemon(tipoPoke) {



        for (let i = 1; i <= cantTotalPokemon && cantidadMostrada <= 9; i++) {
            const response = await fetch(url + "pokemon/" + i);

            const data = await response.json();

            determinarTipo(tipoPoke, data);


        }

        usandose = false;
    };

    function determinarTipo(tipoPoke, poke) {

        if (tipoPoke === "all") {
            mostrarPokemon(poke);
        } else {
            const listaTipos = poke.types.map(function (currentElement) {
                return currentElement.type.name;
            });

            if (listaTipos.includes(tipoPoke)) {
                mostrarPokemon(poke);
            }
        };

    }


    function mostrarPokemon(poke) {

        console.log(poke);

        cantidadMostrada = document.querySelectorAll('.pokemon').length;

        //if (cantidadMostrada <= 9) {

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

        //}




    }








});