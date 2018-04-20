/*
 * Create a list that holds all of your cards
 */
 /*jshint esversion: 6 */
 /*globals $:false */

let cardLists = [
                    "fa-diamond",
                    "fa-paper-plane-o",
                    "fa-anchor",
                    "fa-bolt",
                    "fa-cube",
                    "fa-leaf",
                    "fa-bicycle",
                    "fa-bomb"
                ];
// to store number of moves and matches found
let moves = 0;
let matchFound = 0;

// check when first card is opened
let gameStarted = false;

// timer object
var Timer = new Timer();
let timer = Timer;
timer.addEventListener('secondsUpdated', function (e) {                   $('#timer').html(timer.getTimeValues().toString());
});

// reference to reset button
$('#reset-button').click(resetGame);
// create and append card html
const createCard = card => {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
};
// generate random cards on the deck
const generateCards = () => {
    for (let i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
};
// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = array => {
    let currentIndex = array.length,
    temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};
// Array to keep track of open cards
let openCards = [];

// card functionality
function toggleCard() {

    // start the timer when first card is opened
    if (gameStarted === false) {
        gameStarted = true;
        timer.start();
    }

    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableCLick();
    }
    else if (openCards.length === 1) {
        // increment moves
        updateMoves();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}
// Disable click of the open Cards
const disableCLick = () => {
    openCards.forEach(function (card) {
        card.off('click');
    });
};
// enable click on the open card
const enableClick = () => {
    openCards[0].click(toggleCard);
};
// check openCards if they match or not
const matchOpenCards = () => {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        console.log("matchCard");
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableClick();
        removeOpenCards();
    }
};

// function to remove openCards
const removeOpenCards = () => openCards = [];

// function to add animations
$.fn.extend({
    animateCss: function (animationName) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});
// update moves
const updateMoves = () => {
    moves++;
    $('#moves').html(`${moves} Moves`);
    if (moves == 24) {
        addBlankStar();
    }
    else if (moves == 15) {
        addBlankStar();
    }
};
// check whether the game is finished or not
const checkWin = () => {
    matchFound += 1;
    if (matchFound == 8) {
        showResults();
    }
};
// add blank stars
function addBlankStar() {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}
// add initial stars
function addStars() {
    for (let i = 0; i < 3; i++) {
        $('#stars').append('<li><i class="fa fa-star"></i></li>');
    }
}
// reset the game
function resetGame() {
    moves = 0;
    matchFound = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#game-deck')[0].style.display = "";
    $('#sucess-result')[0].style.display = "none";
    gameStarted=false;
    timer.stop();
    $('#timer').html("00:00:00");
    playGame();
}
// Init function
function playGame() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Moves");
    addStars(3);
    cardSize();
}
// shows result on end game
const showResults = () => {
    $('#sucess-result').empty();
    timer.pause();
    let scoreBoard = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " /> </svg>
        <p class="success"> Congrats !!! </p>
        <p>
            <span class="score-titles">Moves:</span>
            <span class="score-values">${moves}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>
             </div>
             <div class="star">
                <i class="fa ${ (moves > 23) ? "fa-star-o" : "fa-star"}  fa-3x"></i>
             </div>
            <div class="star">
                <i class="fa ${ (moves > 14) ? "fa-star-o" : "fa-star"} fa-3x"></i>
             </div>
        </div>
        <div class="text-center margin-top-2" id="restart">
            <i class="fa fa-repeat fa-2x"></i>
          </div>
    `;
    $('#game-deck')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#restart').click(resetGame);
};

// start the game
playGame();


// card height equal to width
function cardSize(){
    var cardWidth = $('.card').width();
    $('.card').height(cardWidth);
}

$(window).on('resize load', cardSize);