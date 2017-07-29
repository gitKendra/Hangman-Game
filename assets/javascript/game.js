
// Initialize variables
const POINT_VALUE = 10;
const POINT_MULTIPLIER = 5;

var flag = 0;
var wins = 0;
var currentScore = 0;
var totalScore = 0;
var wrongGuesses = 0;

var listOfWords = ["accommodate", "achieve", "apparently", "appearance", "believe",
					"basically", "bizarre", "calendar", "chauffeur", "cemetery", 
					"committee", "conscious", "ecstasy", "existence", "foreseeable",
					"gist", "glamorous", "immediately", "irresistible", "pavilion",
					"pharaoh", "piece", "publicly", "separate", "resistance", 
					"surprise", "tendency", "truly", "unfortunately"];

var randNum = Math.floor(Math.random() * listOfWords.length);		
var currentWord = listOfWords[randNum];

console.log("current word is " + currentWord);

// in html, use <span id="id_name">text here</span> for inline changes

// Declare and initialize boolean arrays
var usedWord = [];
initBooleanArray(usedWord, listOfWords.length);
var letterGuessed = [];
initBooleanArray(letterGuessed, 26);


var scoreBoard =
	  "<p>Number of wins: " + wins + "</p>" +
      "<p>Current game score: " + currentScore + "</p>" +
      "<p>Total overall score: " + totalScore + "</p>"
      ;

// /* Functions */
// // Funtion runs whenever the user presses a key.
function initBooleanArray (arr, size) {
	for (var i = 0; i < size; i++) {
	  arr[i] = false;
	}
}
// function setBooleanArrayFalse (arr) {
// 	for (var i = 0; i < arr.length; i++) {
// 	letterGuessed[i]=false;
// 	console.log("Array " + arr + "value: " + letterGuessed[i]);
// 	}
// }
function startGame() {

	var hangmanImg =
	"<img src=assets/images/hangman-"+wrongGuesses+".png>" +
	"<p>Press a letter to make a guess.</p>"
	;
	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
	document.querySelector("#scoreBoard").innerHTML = scoreBoard;
}

// function replayGame() {
// 	currentScore = 0;

// }

// What to do on keypress
document.onkeyup = function(event){
	var userGuess = event.which;
console.log("userGuess is " + userGuess); //parseInt() possibly

	// Special case only used to start the game and set the page
	if (flag == 0 && userGuess != 32){
		console.log("flag 0 userGuess not spacebar");
		return;
	}
	else if (flag == 0 && userGuess == 32) {
		startGame();
		flag = 1;
		return;
	}
	else if (letterGuessed[userGuess]){
		alert("That letter has already been guessed. Try another.");
		return;
	}
	else if (!isALetter(userGuess)){
		alert("Not a valid selection. Please type a letter.");
		return;
	}
	else {
		guessLetter(userGuess-65);
	}

	//update webpage with current score after each letter guess
     document.querySelector("#scoreBoard").innerHTML = scoreBoard;
}


// Function that returns true if user enters something that's not a letter.
//  Returns false otherwise.
function isALetter (n) {
	return (n >= 65 && n <= 90);
	// return (n >= 65 && n <= 90 || n >= 97 && n <= 122);
}
	

// Function that takes valid userGuess and places it on board.
function guessLetter (n) {

	// // check if letter is in word
	// if (){ // If letter is in word
	// 	//update word with guessed letters
	// }
	// else {
	// 	// Put letter on board of guessed letters
	// }
	
	// mark letterGuessed as true
	letterGuessed[n] = true;
	console.log("Letter guessed in index " + n);
}

// // Function that places the letter on the board and returns true if the letter is in the word.
// //  Returns false otherwise.
// function playableLetter(letter, word) {
// 	// Loop through word to determing if letter exists
// 	for (var i = 0; i < word.length; i++) {
// 		if {

// 		}
// 	}
// }
