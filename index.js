let firstCard = undefined;
let secondCard = undefined;
let pairs = 0;
let num_matchedPairs = 0;
let clicks = 0;
let start = false;
let powerUp = false;
let timer = undefined;

//Randomizer Function
const getRandomElements = (array, numElements) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numElements);
};

//Shuffle Function
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

//Start Game Timer Function
const startTime = () => {
    const startTime = new Date().getTime();

    timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;

        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);

        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

        $('.timer').text(`${minutesStr}:${secondsStr}`);
    }, 1000);
};

//Stop Game Timer Function
const stopTime = () => {
    clearInterval(timer);
};

//Winning Message Function
const winningMessageAlert = () => {
    alert('Congratulations! You won the game!');
};

//Fill Cards Function
const populateCards = () => {
    const gameGrid = $('#game_board');
    gameGrid.empty();

    for (let i = 0; i < pairs * 2; i++) {
        const card = $('<div>').addClass('card');
        const frontFace = $('<img>').addClass('front_face');
        const backFace = $('<img>').addClass('back_face').attr('src', '/images/back.webp');

        frontFace.attr('src', pokeImages[i]);

        card.append(frontFace);
        card.append(backFace);

        gameGrid.append(card);
    }

    clickCards();
};

//Click Cards Function
const clickCards = () => {
    $('.card').on('click', function () {
        if (!start) {
            startTime();
            start = true;
        }

        if ($(this).hasClass('flip') || $(this).hasClass('matched')) {
            return;
        }

        $(this).toggleClass('flip');
        const clickedCardSrc = $(this).find('.front_face').attr('src');

        if (!firstCard) {
            firstCard = clickedCardSrc;
        } else {
            secondCard = clickedCardSrc;
            clicks++;

            $('.clicks').text(clicks + 1);

            if (firstCard === secondCard) {
                num_matchedPairs++;
                $('.pairs-matched').text(num_matchedPairs);

                $(`.card .front_face[src="${firstCard}"]`).parent('.card').addClass('matched');
                $(`.card .front_face[src="${secondCard}"]`).parent('.card').addClass('matched');

                if (num_matchedPairs === pairs) {
                    stopTime();
                    winningMessageAlert();
                }
            } else {
                setTimeout(() => {
                    $('.flip:not(.matched)').removeClass('flip');
                }, 1000);
            }

            firstCard = undefined;
            secondCard = undefined;
        }
    });
};


//Power Up - Show Cards for 3 Seconds
const powerUpStart = () => {
    if (!powerUp) {
        $('.card').addClass('flip');
        setTimeout(() => {
            $('.card').removeClass('flip');
            powerUp = false;
        }, 3000);

        powerUp = true;
    }
};

//API Stuff
const pokemonURL = 'https://pokeapi.co/api/v2/pokemon';
const pokeImages = [];

//Get Pokemons
const fetchRandomPokemon = async () => {
    try {
        const response = await fetch(`${pokemonURL}?limit=${pairs}`);
        const data = await response.json();
        const randomPokemon = getRandomElements(data.results, pairs);

        for (let i = 0; i < pairs; i++) {
            const pokemon = randomPokemon[i];
            const pokemonURL = pokemon.url;

            const pokemonResponse = await fetch(pokemonURL);
            const pokemonData = await pokemonResponse.json();

            const pokemonImage = pokemonData.sprites.front_default;

            pokeImages
                .push(pokemonImage);
            pokeImages
                .push(pokemonImage);
        }

        shuffleArray(pokeImages);
        populateCards();
    } catch (error) {
        console.log('Error fetching random Pokémon:', error);
    }
};

//Start Game
const startGame = async (difficulty) => {
    switch (difficulty) {
        case 'E':
            pairs = 3;
            break;
        case 'M':
            pairs = 6;
            break;
        case 'H':
            pairs = 9;
            break;
        default:
            pairs = 3;
    }

    await fetchRandomPokemon();
    resetGame();
};

//Reset Game
const resetGame = () => {
    firstCard = undefined;
    secondCard = undefined;
    num_matchedPairs = 0;
    clicks = 0;
    start
        = false;
    powerUp = false;

    $('.clicks').text(clicks);
    $('.pairs-matched').text(num_matchedPairs);
    $('.pairs-left').text(pairs);
    $('.timer').text('00:00');

    stopTime();

    $('.card').removeClass('flip matched');
};

const changeTheme = (theme) => {
    $('body').removeClass();
    $('body').addClass('theme-' + theme);
    $('header').removeClass();
    $('header').addClass('theme-' + theme);
    $('h1').removeClass();
    $('h1').addClass('theme-' + theme);
};

//Event Listeners
const eventListeners = () => {
    $('.start').on('click', async () => {
        const difficultySelector = $('.difficulty-levels').val();
        await startGame(difficultySelector);
    });

    $('.reset').on('click', resetGame);

    $('.select-theme').on('change', () => {
        const selectedTheme = $('.select-theme').val();
        changeTheme(selectedTheme);
    });

    $('.power-up').on('click', powerUpStart);
};

//Setup
const setup = async () => {
    $(document).ready(() => {
        eventListeners();
        fetchRandomPokemon();
    });
};

setup();