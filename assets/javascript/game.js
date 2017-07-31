
// Initialize variables
const POINT_VALUE = 10;
const POINT_MULTIPLIER = 5;

var flag = 0;
var wins = 0;
var currentScore = 0;
var totalScore = 0;
var numWrongGuesses = 0;
var alphabetArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
					"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var wordList = ["accommodate", "achieve", "apparently", "appearance", "believe",
					"basically", "bizarre", "calendar", "chauffeur", "cemetery", 
					"committee", "conscious", "ecstasy", "existence", "foreseeable",
					"gist", "glamorous", "immediately", "irresistible", "pavilion",
					"pharaoh", "piece", "publicly", "separate", "resistance", 
					"surprise", "tendency", "truly", "unfortunately"];

var randNum = Math.floor(Math.random() * wordList.length);

var currentWord = wordList[randNum];
console.log("Current word is "+currentWord);
var puzzleWord = [currentWord.length];
var puzzle = document.getElementById("puzzle");
var usedLetters = document.getElementById("used-letters");
var hangmanImg = "<img src=assets/images/hangman-"+numWrongGuesses+".png>";

// every letter in the word is symbolized by an underscore in the puzzlefield
for (var i = 0; i < currentWord.length; i++){
	puzzleWord[i] = "_ ";
}

// Declare and initialize boolean arrays
var usedWord = [];
var letterGuessed = [];
initBooleanArray(letterGuessed, 26);
initBooleanArray(usedWord, wordList.length);

//var gameBoard ;
var alphabetButton =
	"<button type=\"button\" id=\"btn-a\" class=\"btn btn-default\">a</button>" + 
	"<button type=\"button\" id=\"btn-b\" class=\"btn btn-default\">b</button>" +
	"<button type=\"button\" id=\"btn-c\" class=\"btn btn-default\">c</button>" +
	"<button type=\"button\" id=\"btn-d\" class=\"btn btn-default\">d</button>" +
	"<button type=\"button\" id=\"btn-e\" class=\"btn btn-default\">e</button>" +
	"<button type=\"button\" id=\"btn-f\" class=\"btn btn-default\">f</button>" +
	"<button type=\"button\" id=\"btn-g\" class=\"btn btn-default\">g</button>" +
	"<button type=\"button\" id=\"btn-h\" class=\"btn btn-default\">h</button>" +
	"<button type=\"button\" id=\"btn-i\" class=\"btn btn-default\">i</button>" +
	"<button type=\"button\" id=\"btn-j\" class=\"btn btn-default\">j</button>" +
	"<button type=\"button\" id=\"btn-k\" class=\"btn btn-default\">k</button>" +
	"<button type=\"button\" id=\"btn-l\" class=\"btn btn-default\">l</button>" +
	"<button type=\"button\" id=\"btn-m\" class=\"btn btn-default\">m</button>" +
	"<button type=\"button\" id=\"btn-n\" class=\"btn btn-default\">n</button>" +
	"<button type=\"button\" id=\"btn-o\" class=\"btn btn-default\">o</button>" +
	"<button type=\"button\" id=\"btn-p\" class=\"btn btn-default\">p</button>" +
	"<button type=\"button\" id=\"btn-q\" class=\"btn btn-default\">q</button>" +
	"<button type=\"button\" id=\"btn-r\" class=\"btn btn-default\">r</button>" +
	"<button type=\"button\" id=\"btn-s\" class=\"btn btn-default\">s</button>" +
	"<button type=\"button\" id=\"btn-t\" class=\"btn btn-default\">t</button>" +
	"<button type=\"button\" id=\"btn-u\" class=\"btn btn-default\">u</button>" +
	"<button type=\"button\" id=\"btn-v\" class=\"btn btn-default\">v</button>" +
	"<button type=\"button\" id=\"btn-w\" class=\"btn btn-default\">w</button>" +
	"<button type=\"button\" id=\"btn-x\" class=\"btn btn-default\">x</button>" +
	"<button type=\"button\" id=\"btn-y\" class=\"btn btn-default\">y</button>" +
	"<button type=\"button\" id=\"btn-z\" class=\"btn btn-default\">z</button>"
	;


// /* Functions */

function startGame() {

	flag = 1;
	
	var instructions = "<p>Press a letter to make a guess.</p>";
	var usedTitle = "<h3>Incorrect Letters Guessed</h3>";
	var puzzleTitle = "<h3>Puzzle</h3>";
	var scoreBoard =
	"<p>Guesses remaining: " + (10 - numWrongGuesses) + "</p>" +
	"<p>Number of wins: " + wins + "</p>" +
    "<p>Current game score: " + currentScore + "</p>" +
    "<p>Total overall score: " + totalScore + "</p>"
    ;
	document.querySelector("#rules").innerHTML = instructions;
	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
	document.querySelector("#score-board").innerHTML = scoreBoard;
	document.querySelector("#puzzle").innerHTML = puzzleTitle;
	document.querySelector("#used-letters").innerHTML = usedTitle;

	printPuzzle();
//	document.querySelector("#alphabet-btns").innerHTML = alphabetButton;
}
// function replayGame() {
// 	currentScore = 0;
// }

// What to do on keypress
document.onkeyup = function(event){
	var userGuess = event.which;
	var userGuessIndex = userGuess-65;

	// Special case 1 and 2: Don't start game unless spacebar is pressed
	if (flag == 0 && userGuess != 32){
		console.log("flag 0 userGuess not spacebar");
		return;
	}
	else if (flag == 0 && userGuess == 32) {
		startGame();
		return;
	}
	// If letter has previously been guessed, alert user.
	else if (letterGuessed[userGuessIndex]){
		alert("The letter '"+alphabetArray[userGuessIndex]+"' has already been guessed. Try another.");
		return;
	}
	// If not a letter, do nothing.
	else if (!isALetter(userGuess)){
		return;
	}
	// valid user guess calls function to play the letter on the board
	else { 
		guessLetter(userGuessIndex);
		
	}

	var scoreBoard =
	"<p>Guesses remaining: " + (10 - numWrongGuesses) + "</p>" +
	"<p>Number of wins: " + wins + "</p>" +
    "<p>Current game score: " + currentScore + "</p>" +
    "<p>Total overall score: " + totalScore + "</p>"
    ;
	//update webpage with current score after each letter guess
     document.querySelector("#score-board").innerHTML = scoreBoard;

	// Check to see if game is over or if the user won
     if (numWrongGuesses >= 10) {
     	//game over
     	alert("Game Over!!");
     }
     if (puzzleSolved()) {
     	alert("You've solved the word with a score of " + currentScore + "!");
     	wins++;
     	totalScore += currentScore;
     	//reset game
     }     
}

function puzzleSolved(){
	var flag = true;
	for (var i = 0; i < puzzleWord.length; i++) {
		if (puzzleWord[i] === "_ ") {
			flag = false;
		}
	}
	return flag;
}

// Function that returns true if user enters something that's not a letter.
//  Returns false otherwise.
function isALetter (n) {
	return (n >= 65 && n <= 90);
	// return (n >= 65 && n <= 90 || n >= 97 && n <= 122);
}
	

// Function that takes in the alphabet index of a valid userGuess and places it on the game board.
function guessLetter (index) {

	// check if letter is in word
	if (playableLetter(index)) { // If letter is in word
		puzzle.innerHTML=""; // delete current puzzle
		printPuzzle();   // print updated puzzle
	}
	else {
		var wrongChar = alphabetArray[index].toUpperCase();
		numWrongGuesses++;
		document.querySelector("#hangman-pic").innerHTML = hangmanImg;

		// add letter to the used-letters section
		var letter = document.createTextNode(" " + wrongChar);
		usedLetters.appendChild(letter);
	}	
	
	letterGuessed[index] = true;
}


// Function that places the letter on the board and returns true if the letter is in the word.
//  Returns false otherwise.
function playableLetter(index) {

	var letterInWord = false;

	// Loop through word to determing if letter exists. Update array with guessed letter.
	for (var i = 0; i < currentWord.length; i++) {
		if (alphabetArray[index] === currentWord[i]) {
			currentScore += POINT_VALUE;
			puzzleWord[i] = alphabetArray[index].toUpperCase() + " "; // update the puzzle board with letter
			letterInWord = true; //update flag with true
		}
	}

	printArray(puzzleWord);
	return letterInWord;
}

// prints the Current state of the puzzle
function printPuzzle(){
	for (var i = 0; i < puzzleWord.length; i++){
		var letter = document.createTextNode(puzzleWord[i]);
		puzzle.appendChild(letter);
	}
}

// Funtion runs whenever the user presses a key.
function initBooleanArray (arr, size) {
	for (var i = 0; i < size; i++) {
	  arr[i] = false;
	}
}

function printArray(arr){
	console.log("Print array: ");
	for(var i=0; i<arr.length; i++){
		console.log(arr[i]);
	}
}