function setup() {
    let firstCard = undefined;
    let secondCard = undefined;
    let numPairs = 0;
    let pairsMatched = 0;
    let clicks = 0;
    let gameStarted = false;
    let powerUpActive = false;
    let timerInterval = undefined;

    const baseURL = 'https://pokeapi.co/api/v2/pokemon';
    const cardImages = [];

    async function fetchRandomPokemon() {
        try {
            const response = await fetch(`${baseURL}?limit=${numPairs}`);
            const data = await response.json();
            const randomPokemon = getRandomElements(data.results, numPairs);

            for (let i = 0; i < numPairs; i++) {
                const pokemon = randomPokemon[i];
                const pokemonURL = pokemon.url;

                const pokemonResponse = await fetch(pokemonURL);
                const pokemonData = await pokemonResponse.json();

                const pokemonImage = pokemonData.sprites.front_default;

                cardImages.push(pokemonImage);
                cardImages.push(pokemonImage);
            }

            shuffleArray(cardImages);
            populateCards();
        } catch (error) {
            console.log('Error fetching random Pokémon:', error);
        }
    }

    function getRandomElements(array, numElements) {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numElements);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function populateCards() {
        const gameGrid = $('#game_grid');
        gameGrid.empty();

        for (let i = 0; i < numPairs * 2; i++) {
            const card = $('<div>').addClass('card');
            const frontFace = $('<img>').addClass('front_face');
            const backFace = $('<img>').addClass('back_face').attr('src', 'back.webp');

            frontFace.attr('src', cardImages[i]);

            card.append(frontFace);
            card.append(backFace);

            gameGrid.append(card);
        }

        addCardClickListeners();
    }

    function addCardClickListeners() {
        $('.card').on('click', function () {
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
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

                $('.clicks span').text(clicks);

                if (firstCard === secondCard) {
                    pairsMatched++;
                    $('.matched-pairs span').text(pairsMatched);

                    $(`.card .front_face[src="${firstCard}"]`).parent('.card').addClass('matched');
                    $(`.card .front_face[src="${secondCard}"]`).parent('.card').addClass('matched');

                    if (pairsMatched === numPairs) {
                        stopTimer();
                        showWinningMessage();
                    }
                } else {
                    setTimeout(() => {
                        $(`.card .front_face[src="${firstCard}"]`).parent('.card').addClass('flip');
                        $(`.card .front_face[src="${secondCard}"]`).parent('.card').addClass('flip');
                    }, 1000);
                }

                firstCard = undefined;
                secondCard = undefined;
            }
        });
    }

    function startTimer() {
        const startTime = new Date().getTime();

        timerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;

            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);

            const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
            const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

            $('.timer').text(`${minutesStr}:${secondsStr}`);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function showWinningMessage() {
        alert('Congratulations! You won the game!');
    }

    function startGame(difficulty) {
        switch (difficulty) {
            case 'easy':
                numPairs = 3;
                break;
            case 'medium':
                numPairs = 6;
                break;
            case 'hard':
                numPairs = 9;
                break;
            default:
                numPairs = 3;
        }

        fetchRandomPokemon();
        resetGame();
    }

    function resetGame() {
        firstCard = undefined;
        secondCard = undefined;
        pairsMatched = 0;
        clicks = 0;
        gameStarted = false;
        powerUpActive = false;

        $('.clicks span').text(clicks);
        $('.matched-pairs span').text(pairsMatched);
        $('.left-pairs span').text(numPairs);
        $('.timer').text('00:00');

        stopTimer();

        $('.card').removeClass('flip matched');
    }

    function applyTheme(theme) {
        $('body').removeClass().addClass('theme-' + theme);
        $('header').removeClass().addClass('theme-' + theme);
        $('h1').removeClass().addClass('theme-' + theme);
    }

    function activatePowerUp() {
        if (!powerUpActive) {
            $('.card').addClass('flip');
            setTimeout(() => {
                $('.card').removeClass('flip');
                powerUpActive = false;
            }, 3000);

            powerUpActive = true;
        }
    }

    $(document).ready(() => {
        $('.start').on('click', () => {
            const selectedDifficulty = $('.levels').val();
            startGame(selectedDifficulty);
        });

        $('.reset').on('click', resetGame);

        $('.theme').on('change', () => {
            const selectedTheme = $('.theme').val();
            applyTheme(selectedTheme);
        });

        $('.power-up').on('click', activatePowerUp);
    });
}

setup();