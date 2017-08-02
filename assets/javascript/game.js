
// Initialize variables
const POINT_VALUE = 10;
const POINT_MULTIPLIER = 5;

var flag = 0;
var counter = 0; // counts number of words played
var lives = 3;
var wins = 0;
var currentScore = 0;
var totalScore = 0;
var numWrongGuesses = 0;

var alphabetArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
					"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var wordList = ["accommodate", "achieve", "apparently", "appearance", "believe",
				"basically", "bizarre", "calendar", "chauffeur", "cemetery", 
				"committee", "conscious", "ecstasy", "existence", "foreseeable",
				"gist", "glamorous", "immediately", "irresistible", "pavilion",
				"pharaoh", "piece", "publicly", "separate", "resistance", 
				"surprise", "tendency", "truly", "unfortunately"];

var randNum = Math.floor(Math.random() * wordList.length);

// Set HTML element variables
var puzzle = document.getElementById("puzzle-word");
var usedLetters = document.getElementById("letters-guessed");
var alphabetBtns = document.getElementById("alphabet-btns");
var currentWord = wordList[randNum];
var puzzleWord = [currentWord.length];

// Initialize boolean arrays to track used letters and words
var usedWord = [];
var letterGuessed = [];
initBooleanArray(letterGuessed, 26);
initBooleanArray(usedWord, wordList.length);
usedWord[randNum] = true;

// /* Functions */ //

function startGame() {

	// Game has been started
	flag = 1;
	
	// Initialize puzzle word with underscores
	for (var i = 0; i < currentWord.length; i++){
		puzzleWord[i] = "_ ";
	}

	// Clear/delete puzzle and incorrect guesses section
	puzzle.innerHTML= "";
	usedLetters.innerHTML= "";
	document.getElementById("alphabet-btns").innerHTML = "";

	// Set text variables to be updated in HTML
	var instructions = "Type or Press a letter to make a guess.";
	var hangmanImg = "<img src=assets/images/hangman-"+numWrongGuesses+".png class=\"img-responsive\">";
	var usedTitle = "Incorrect Guesses";
	var puzzleTitle = "Puzzle";
	var statTitle = "Stats";

	// Change HTML with appropriate text and images
	document.querySelector("#rules").innerHTML = instructions;
	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
	initAlphabetBtns();
	document.querySelector("#puzzle-title").innerHTML = puzzleTitle;
	document.querySelector("#used-title").innerHTML = usedTitle;
	document.querySelector("#stat-title").innerHTML = statTitle;
	document.querySelector("#stats").innerHTML = updateScore();
	printPuzzle();
}

// What to do after key has been pressed
document.onkeyup = function(event){

	// Check if user completed all words in the list or lost too many lives to play again
	if (counter == wordList.length || lives == 0) {
		//Game over. Do nothing on user interaction.
	}
	else{

		// Record keyup into variable
		var userGuess = event.which;
		// Adjust index value of appropriate alphabetArray
		var userGuessIndex = userGuess-65;

		// Special case 1 and 2: Don't start game unless spacebar is pressed
		if (flag == 0 && userGuess != 32){
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
		// valid user guess calls function to play the letter on the board and updates html
		else {
			guessLetter(userGuessIndex);

			//update webpage with current details
			var hangmanImg = "<img src=assets/images/hangman-"+numWrongGuesses+".png class=\"img-responsive\">";
	     	document.querySelector("#stats").innerHTML = updateScore();
	     	document.querySelector("#hangman-pic").innerHTML = hangmanImg; 
		}

		endGameCheck(); //Check if game is over
	} // end else
} // end onkey call

//Function that checks if end game condition is met
function endGameCheck(){
    
    // User won the round
    if (puzzleSolved()) {

    	wins++;

    	// Update HTML
    	var hangmanImg = "<img src=assets/images/hangman-win.png class=\"img-responsive\">";
    	document.querySelector("#rules").innerHTML = instructions;
     	document.querySelector("#stats").innerHTML = updateScore();
     	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
     	
     	// reset flag to play again
     	flag = 0;
     	var instructions = "Play again? Press the spacebar or click the button to play again."
     	document.querySelector("#rules").innerHTML = instructions;

     	resetGame();
     } 
     
    // User lost the round
    if (numWrongGuesses == 10) {

     	lives--;
     	var instructions;

     	// Set variable to inform if user can play again or not
     	if (lives > 0) {
     		instructions = "You lost a life!! Press the spacebar or click the button to try again."
     		flag = 0; // reset flag to play again
     	}
     	else {
     		instructions = "Game Over!! Thanks for playing."
     		flag = -1; // mark as game over
     	}

     	// Update HTML elements
     	puzzleTitle = "Puzzle Answer"
     	var hangmanImg = "<img src=assets/images/hangman-lose.png class=\"img-responsive\">";
     	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
     	document.querySelector("#rules").innerHTML = instructions;
     	document.querySelector("#stats").innerHTML = updateScore();
     	document.querySelector("#puzzle-title").innerHTML = puzzleTitle;
     	
     	// Update Puzzle with correct answer
     	puzzle.innerHTML = "";
     	for(var i = 0; i<currentWord.length; i++){
     		var letter = document.createTextNode(currentWord[i] + " ");
			puzzle.appendChild(letter);
     	}

     	resetGame();
    }
}
		
// Function that resets the board and elements after loss/win to start new round
function resetGame() {

	// Reset variables for new game
	counter = 0;
	currentScore = 0;
	numWrongGuesses = 0;
	initBooleanArray(letterGuessed, 26);
	currentWord = [];
	puzzleWord = [];
	
	// Create/add button to play again
	if (flag == 0) {
		document.getElementById("alphabet-btns").innerHTML = "";
		var btn = document.createElement("button");
		btn.className = "btn btn-info";
		btn.innerHTML = "<p>Play Again</p>";
		btn.onclick = function(){startGame()}
		alphabetBtns.appendChild(btn);
	}

	// Get a word that hasn't been used in previous game and assign it
	do {
		randNum = (randNum + 4) % 29;
	} while (usedWord[randNum]);
	
	currentWord = wordList[randNum];
	puzzleWord = [currentWord.length];
	usedWord[randNum] = true;
}

// Function returns Boolean. If puzzle doesn't contain any underscores it is solved.
function puzzleSolved(){
	
	var isSolved = true;
	
	for (var i = 0; i < puzzleWord.length; i++) {
		if (puzzleWord[i] === "_ ") {
			return false;
		}
	}
	return isSolved;
}

// Function that returns true if user enters something that's not a letter. Returns false otherwise.
function isALetter (n) {
	
	return (n >= 65 && n <= 90);
}

// Function that takes in the alphabet index of a valid userGuess and places the letter on the game board.
function guessLetter (index) {
	
	// check if letter is in word
	if (playableLetter(index)) {
		puzzle.innerHTML= ""; // delete current puzzle
		printPuzzle();   // print updated puzzle
	}
	else {
		numWrongGuesses++;

		// add letter to the used-letters section of HTML
		var letter = document.createTextNode(" " + alphabetArray[index]);
		usedLetters.appendChild(letter);
	}	

	// Keep user from guessing same letter by setting disabling the button and setting boolean array
	document.getElementById("btn"+alphabetArray[index]).disabled = true;
	letterGuessed[index] = true;
}

// Function that places the letter on the board and returns true if the letter is in the word.
//  Returns false otherwise.
function playableLetter(index) {
	
	var letterInWord = false;
	
	// Loop through word to determing if letter exists. Update array with guessed letter.
	for (var i = 0; i < currentWord.length; i++) {

		if (alphabetArray[index] === currentWord[i].toUpperCase()) {
			currentScore += POINT_VALUE;
			totalScore += POINT_VALUE;
			puzzleWord[i] = alphabetArray[index] + " "; // update the puzzle board with letter
			letterInWord = true;
		}
	}
	return letterInWord;
}

// function that takes in the button letter object and performs onClick
function selectLetter(ltr){

	ltr.disabled = "disabled"; // disables button
	var index = ltr.innerHTML.charCodeAt(0)-65; // adjust for index value in alphabetArray
	guessLetter(index);
	endGameCheck();
}

// Function to create/add alphabet buttons with attributes to HTML
function initAlphabetBtns() {
	for(var i = 0; i < alphabetArray.length; i++) {
		
		// Create button element
		var btn = document.createElement("button");

		// Assign button attributes
		btn.className = "btn btn-info btnLetter"
		btn.value = btn.innerHTML = alphabetArray[i];
		btn.id = "btn"+alphabetArray[i];
		btn.onclick = function(){selectLetter(this)};

		// Add button to HTML
		alphabetBtns.appendChild(btn);
	}
}

// Prints the puzzle by appending each value in array to HTML element
function printPuzzle() {
	for (var i = 0; i < puzzleWord.length; i++){
		var letter = document.createTextNode(puzzleWord[i] + " ");
		puzzle.appendChild(letter);
	}
}

// Funtion sets boolean array to false.
function initBooleanArray (arr, size) {
	for (var i = 0; i < size; i++) {
	  arr[i] = false;
	}
}

// Function that updates and returns the new score values
function updateScore() {
	var newScore =
	"<p>Guesses remaining: <span class=\"marker\">" + (10 - numWrongGuesses) + "</span></p>" +
	"<p>Lives remaining: <span class=\"marker\">" + lives + "</span></p>" +
	"<p>Number of wins: <span class=\"marker\">" + wins + "</span></p>" +
    "<p>Current game score: <span class=\"marker\">" + currentScore + "</span></p>" +
    "<p>Total overall score: <span class=\"marker\">" + totalScore + "</span></p>"
    ;
	return newScore;
}