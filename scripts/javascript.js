
window.addEventListener('load', async function () {
    const listaPokemon = document.getElementById('listaPokemon');
    const tipoPokemon = document.getElementById('tipoPokemon');
    const botonesHeader = document.querySelectorAll('.button__nav');
    let botonesFooter = new Array();

    const listaFooter = document.getElementById('footer__ul');

    const cantPorPagina = 20;

    let url = "http://pokeapi.co/api/v2/";




    let usandose = false;

    let currentFooterButton = 1;

    let currentSelectedType = "";

    let cantidadTotal = await buscarPokemon("all");
    generarFooter(cantidadTotal);
    currentSelectedType = "all";
    tipoPokemon.innerHTML = "all";


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
                currentFooterButton = 1;
                cantidadTotal = await buscarPokemon(botonType);

                generarFooter(cantidadTotal);
                currentSelectedType = botonType;
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
            button.classList.add('footer__button');
            button.id = `btn${i}`;
            button.innerHTML = i;
            button.style.backgroundColor = "white";

            botonesFooter.push(button);
            li.append(button);
            listaFooter.append(li);
        }

        botonesFooter[0].classList.add('selected-footer-button');
        botonesFooter[0].style.backgroundColor = "red";
        

        botonesFooter.forEach(function (boton) {
            boton.addEventListener("click", function () {
                botonesFooter.forEach(function (boton) {
                    boton.classList.remove('selected-footer-button');
                    boton.style.backgroundColor = "white";
                });
                boton.classList.add('selected-footer-button');
                boton.style.backgroundColor = "red";
                currentFooterButton = parseInt(boton.id.substr(3));
                buscarPokemon(currentSelectedType);
            });
        });

    }

    async function buscarPokemon(tipoPoke) {
        
        listaPokemon.innerHTML = "";
        let urlTipo = url;
        let cantidadTotal = 0;
        console.log(currentFooterButton);
        let offset = (currentFooterButton - 1) * cantPorPagina;
        if (tipoPoke === "all") {
            urlTipo += `pokemon?limit=${cantPorPagina}&offset=${offset}`;
        } else {
            urlTipo += "type/" + tipoPoke;

        }

        let response = await fetch(urlTipo);
        let data = await response.json();

        if (tipoPoke === "all") {
            cantidadTotal = data.count;
            
        } else {
            cantidadTotal = data.pokemon.length;
        }

        if (tipoPoke === "all") {
            for (let i = 0; i < data.results.length; i++) {
                try {
                    let responsePoke = await fetch(data.results[i].url);

                    let dataPoke = await responsePoke.json();
                    mostrarPokemon(dataPoke);
                } catch (err) {
                    console.log(err);
                }

            }



        } else {
            console.log({offset}, {cantidadTotal}, {cantPorPagina});
            for (let i = offset; i < cantidadTotal && i < offset + cantPorPagina; i++) {
                
                try {
                    let responsePoke = await fetch(data.pokemon[i].pokemon.url);

                    let dataPoke = await responsePoke.json();
                    mostrarPokemon(dataPoke);
                    
                } catch (err) {
                    console.log(err);
                }
            }



        }



        usandose = false;
        return cantidadTotal;
    };



    function mostrarPokemon(poke) {
        let tipos = poke.types.map(function (type, index) {
            return `<p class="${type.type.name} tipo">Tipo ${index + 1}: ${type.type.name}</p>`;
        });

        if(tipos.length === 1){
            tipos.push(`<p class="emptyType tipo">Tipo 2: no tiene</p>`);
        }
        tipos = tipos.join('');

        let pokeId = String(poke.id).padStart(3, "0");

        const div = document.createElement("div");
        div.classList.add("pokemon");
        let defaultImage = poke.sprites.other["official-artwork"].front_default;
        if(defaultImage === null){
            defaultImage = "media/images/image-not-found.png";
        }
        
        
        
        div.innerHTML = `<div class="pokemon-info">       
        <div class="nombre-contenedor">
            <p class="pokemon-id">Número pokédex: #${pokeId}</p>
            <h2 class="pokemon-nombre">Nombre: ${poke.name}</h2>
        </div>
        <div class="pokemon-imagen">
        <img src="${defaultImage}" alt="${poke.name}">
        </div> 
        <div class="pokemon-tipos">${tipos}</div>
        <div class="pokemon-stats">
            <p class="stat">Altura: ${poke.height}</p>
            <p class="stat">Peso: ${poke.weight}</p>
        </div>
        </div>`;


        listaPokemon.append(div);






    }








});