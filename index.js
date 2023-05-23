const setup = () => {
    const URL = "https://pokeapi.co/api/v2/pokemon"
    const pokeNames = []
    const pokeImages = []
    const pairs = 0



const getRandomElements = async (array, numElements) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numElements);
};

const shuffle = async (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const fetchRandomPokemon = async () => {
    try {
        const response = await fetch(`${URL}?limit=${pairs}`);
        const pokedata = await response.json();
        const pokeArray = getRandomElements(pokedata.results, pairs);

        for (let i = 0; i < pairs; i++) {
            const pokemon = pokeArray[i];
            const pokeURL = pokemon.url;

            const pokeResponse = await fetch(pokeURL);
            const pokeData = await pokeResponse.json();
            const pokeName = pokeData.name;
            const pokeImage = pokeData.sprites.front_default;

            pokeNames.push(pokeName);
            pokeImages.push(pokeImage);
            pokeNames.push(pokeName);
            pokeImages.push(pokeImage);
        }

        shuffle(pokeImage);
        populateCards();
    } catch (error) {
        console.log(error);
    }
};



const populateCards = async () => {
    const gameBoard = $("#game-board");
    gameBoard.empty();

    for (let i = 0; i < pairs * 2; i++) {
        const pokeCard = $("<div>").addClass("poke-card");
        const front = $('<img>').addClass('front');
        const back = $('<img>').addClass('back').attrc('src', '/images/back.webp');

        front.attrc('src', pokeImages[i]);
        pokeCard.attr('data-pokemon-name', pokeNames[i]);

        pokeCard.append(front, back);

        gameBoard.append(pokeCard);
    }
    clickCards();
};
};

$(document).ready(setup);