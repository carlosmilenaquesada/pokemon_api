
window.addEventListener('load', async function() {
console.log("prueba pull");
    const listaPokemon = document.getElementById('listaPokemon');
    const tipoPokemon = document.getElementById('tipoPokemon');
    const botonesHeader = document.querySelectorAll('.button__nav');
    let botonesFooter = new Array();

    const listaFooter = document.getElementById('footer__ul');

    const cantPorPagina = 20;

    let url = "http://pokeapi.co/api/v2/";


    

    let usandose = false;
    let cantidadMostrada = 0;

    let currentFooterButton = 0;



    let cantPokemon = await buscarPokemon("all");
    generarFooter(cantPokemon);

    botonesHeader.forEach(function (boton) {
        let backgroundButtonColor = getComputedStyle(document.documentElement).getPropertyValue(`--${boton.id}-background-color`);
        boton.style.backgroundColor = backgroundButtonColor;
        boton.style.color = invertHexadecimalColor(backgroundButtonColor);

        boton.addEventListener("click", async function () {

            if (usandose === false) {
                usandose = true;
                let botonType = boton.id;

                tipoPokemon.innerHTML = botonType;
                listaPokemon.innerHTML = "";
                cantidadMostrada = 0;
                let cantidadPokemon = await buscarPokemon(botonType);
                generarFooter(cantidadPokemon);
            }

        });
    });



    function invertHexadecimalColor(hexaOriginal) {
        let invertedColor = undefined;
        if (typeof hexaOriginal === "string") {

            hexaOriginal = hexaOriginal.charAt(0) === "#" ? hexaOriginal.substr(1, hexaOriginal.length - 1) : hexaOriginal;
            if (hexaOriginal.length === 3 || hexaOriginal.length === 6) {


                let filter = /^([0-9a-f]{3}){1,2}$/i;

                if (filter.test(hexaOriginal)) {
                    let hexaToArray = hexaOriginal.split("");
                    let invertHexArray = hexaToArray.map(function (character) {
                        character = parseInt("F", 16) - parseInt(character, 16);
                        return character.toString(16);
                    });


                    invertedColor = "#" + invertHexArray.join('');
                }
            }
        }
        return invertedColor;
    }


    function generarFooter(cantTotalElementos) {
        let cantdBotones = Math.ceil(cantTotalElementos / cantPorPagina);
        listaFooter.innerHTML = "";
        botonesFooter = [];
        for (let i = 1; i <= cantdBotones; i++) {
            let li = document.createElement('li');
            li.classList.add(`footer__li`);
            li.id = `footer-li-${i}`;
            let button = document.createElement('button');
            button.classList.add('footer_button');
            button.id = `btn${i}`;
            button.innerHTML = i;
            button.style.backgroundColor = "white";
            
            botonesFooter.push(button);
            li.append(button);
            listaFooter.append(li);
        }

        botonesFooter[0].classList.add('selected-footer-button');
        botonesFooter[0].style.backgroundColor = "red";
        currentFooterButton = 1;
        
    }

    botonesFooter.forEach(function(boton){        
        boton.addEventListener("click", function(){
            botonesFooter.forEach(function(boton){
                boton.classList.remove('selected-footer-button');
                boton.style.backgroundColor = "white";
            });
            boton.classList.add('selected-footer-button');
            boton.style.backgroundColor = "red";
            currentFooterButton = parseInt(boton.id.substr(3));
        });
    }); 
    

    async function buscarPokemon(tipoPoke) {
        let urlTipo = url;
        let cantidadTotal = 0;

        if (tipoPoke === "all") {
            urlTipo += "pokemon?limit=100000&offset=0";
        } else {
            urlTipo += "type/" + tipoPoke;

        }

        let response = await fetch(urlTipo);
        let data = await response.json();


        if (tipoPoke === "all") {
            for (let i = 0; i < data.count && cantidadMostrada < cantPorPagina; i++) {
                try {
                    let responsePoke = await fetch(data.results[i].url);

                    let dataPoke = await responsePoke.json();
                    mostrarPokemon(dataPoke);
                } catch (err) {
                    console.log(err);
                }

            }
            cantidadTotal = data.count;


        } else {
            for (let i = 0; i < data.pokemon.length && cantidadMostrada < cantPorPagina; i++) {
                try {
                    let responsePoke = await fetch(data.pokemon[i].pokemon.url);

                    let dataPoke = await responsePoke.json();
                    mostrarPokemon(dataPoke);
                } catch (err) {
                    console.log(err);
                }
            }

            cantidadTotal = data.pokemon.length;

        }



        usandose = false;
        return cantidadTotal;
    };



    function mostrarPokemon(poke) {

        cantidadMostrada = document.querySelectorAll('.pokemon').length;
        if (cantidadMostrada < cantPorPagina) {

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




    }








});