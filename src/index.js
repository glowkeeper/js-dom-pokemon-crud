// DOM VARS
const pokeForm = document.querySelector(".poke-form");
const pokeList = document.querySelector(".poke-list");

// CONSTANTS
const remoteURL = "http://localhost:3000/pokemons"
const whiteHeart = "./src/assets/whiteHeart.png"
const redHeart = "./src/assets/redHeart.png"

/*
    {
      "name": "Ivysaur",
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
      "id": 8
    }
*/

// STATE

let state = []

function setState(pokemon, isAdd = true) {
  if ( isAdd ) {
    state.push(pokemon)
    render(pokemon)
  } else { 
    const newState = state.filter( poke => poke.id !== pokemon.id)
    // archive existing state
    state = newState
    renderAll()
  }
}

// DOM
function addPokemon(pokemon) {
  
  const liEl = document.createElement("li");
  const pokeImgEl = document.createElement("img");
  const h2El = document.createElement("h2");
  const deleteButtonEl = document.createElement("button");
  heartImgEl = document.createElement("img");
    
  liEl.classList.add("pokemon");
  pokeImgEl.classList.add("poke");
  heartImgEl.id = `poke${pokemon.id}`

  pokeImgEl.src = pokemon.image;
  h2El.innerText = pokemon.name;
  deleteButtonEl.textContent = 'Delete'
  deleteButtonEl.addEventListener("click", (event) => {
    event.preventDefault();
    deletePokemon(pokemon)
  });
  heartImgEl.src = whiteHeart;
  heartImgEl.addEventListener("click", (event) => {
    const myHeart = document.getElementById(`poke${pokemon.id}`);
    myHeart.src.match(redHeart) ? myHeart.src = whiteHeart : myHeart.src = redHeart
  });

  liEl.append(pokeImgEl, h2El, deleteButtonEl, heartImgEl);
  pokeList.append(liEl);
}


const addPokemons = (pokemons) => {
  pokemons.forEach(pokemon => addPokemon(pokemon))
}

const listenToAddPokemonForm = () => {
  pokeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const pokemon = {
      name: pokeForm.name.value,
      image: pokeForm.image.value
    };
    createPokemon(pokemon)
    pokeForm.reset();
  });
}

// RENDER
const render = (pokemon) => {
  addPokemon(pokemon)
}

const renderAll = () => {
  pokeList.innerHTML = ''
  addPokemons(state)
}

// FETCH CRUD

// READ
const getPokemons = () => {
  fetch(remoteURL)
    .then(res => res.json())
    .then(pokemons => {
      pokemons.forEach(pokemon => setState(pokemon))
    });
}

// CREATE
const createPokemon = (pokemon) => {

    fetch(remoteURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pokemon)
      })
      .then(res =>  res.json())
      .then(pokemon => setState(pokemon));
}

// DELETE
const deletePokemon = (pokemon) => {
  fetch(`${remoteURL}/${pokemon.id}`, {
      method: "DELETE"
    })
    .then(res =>  res.json())
    .then(data => setState(pokemon, false));
}

// MAIN

const run = () => {
  getPokemons()
  listenToAddPokemonForm();
}

run();
