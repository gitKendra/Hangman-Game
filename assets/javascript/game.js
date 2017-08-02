
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


// rewrite as string: var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//var alphabetArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
//					"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
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


//console.log("Current word is " + currentWord);
//console.log("Current word length is " + currentWord.length);

// Initialize boolean arrays to track used letters and words
var usedWord = [];
var letterGuessed = [];
initBooleanArray(letterGuessed, 26);
initBooleanArray(usedWord, wordList.length);
usedWord[randNum] = true;

// /* Functions */

function startGame() {
console.log("Current word is " + currentWord);
	// Initialize variables
	flag = 1;
	
	// Initialize puzzle word with underscores
	for (var i = 0; i < currentWord.length; i++){
		puzzleWord[i] = "_ ";
	}

	initAlphabetBtns();

	// delete puzzle and incorrect guesses
	puzzle.innerHTML= "";
	usedLetters.innerHTML= "";

	// Set text variables to be updated in HTML
	var hangmanImg = "<img src=assets/images/hangman-"+numWrongGuesses+".png class=\"img-responsive\">";
	var instructions = "Press a letter to make a guess.";
	var usedTitle = "Incorrect Guesses";
	var puzzleTitle = "Puzzle";
	var statTitle = "Stats";

	// change html with appropriate text and images
	document.querySelector("#rules").innerHTML = instructions;
	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
	document.querySelector("#puzzle-title").innerHTML = puzzleTitle;
	document.querySelector("#used-title").innerHTML = usedTitle;
	document.querySelector("#stat-title").innerHTML = statTitle;
	document.querySelector("#stats").innerHTML = updateScore();

//	printArray(puzzleWord);
	printPuzzle();
}

	// What to do on keypress
document.onkeyup = function(event){

	// Check if user completed all words in list or lost too many lives
	if (counter == wordList.length || lives == 0) {
		//game over. do nothing
	}
	else{

		// Record keyup into variable and set variable to index value of appropriate alphabetArray
		var userGuess = event.which;
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

function endGameCheck(){		//After letter has been guessed. Check if end game condition results.
		    // User won the round
		    if (puzzleSolved()) {
		    console.log("you're a winner");
		    	document.querySelector("#rules").innerHTML = instructions;
		     	document.querySelector("#stats").innerHTML = updateScore();
		     	var hangmanImg = "<img src=assets/images/hangman-win.png class=\"img-responsive\">";
		     	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
		     	wins++;
		     	totalScore += currentScore;

		     	// reset flag to play again
		     	flag = 0;
		     	// add instructions to press Spacebar to play again
		     	var instructions = "<h3>Play again? Press the spacebar to play again.</h3>"
		     	document.querySelector("#rules").innerHTML = instructions;

		     	resetGame();
		     } 
		     
		    // User lost the round
		    if (numWrongGuesses == 10) {
	//	 console.log("number of wrong guesses is 10");   	
		     	lives--;

		     	// update image and html for Game Over
		     	var hangmanImg = "<img src=assets/images/hangman-lose.png class=\"img-responsive\">";
		     	document.querySelector("#hangman-pic").innerHTML = hangmanImg;
		     	var instructions;
		     	if (lives > 0) {
		     		instructions = "<h3>You lost a life!! Press the spacebar to try again.</h3>"
		     	}
		     	else {
		     		instructions = "<h3>Game Over!! Thanks for playing.</h3>"
		     		flag = -1; // mark as game over
		     	}
		     	document.querySelector("#rules").innerHTML = instructions;
		     	document.querySelector("#stats").innerHTML = updateScore();
		     	
		     	// Show the completed puzzle answer on screen
		     	puzzleTitle = "Puzzle Answer"
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

	// Reset variables
	flag = 0;
	counter = 0;
	currentScore = 0;
	numWrongGuesses = 0;
	initBooleanArray(letterGuessed, 26);
	currentWord = [];
	puzzleWord = [];
	document.getElementById("alphabet-btns").innerHTML = "";

	// Get a word that hasn't been used in previous game and assign it
	do {
		randNum = (randNum + 4) % 29;
	} while (usedWord[randNum]);
	currentWord = wordList[randNum];
	puzzleWord = [currentWord.length];
	usedWord[randNum] = true;

	updateScore();
}

// Function returns Boolean. If puzzle doesn't contain any underscores means puzzle is finished.
function puzzleSolved(){
console.log("Check if puzzle solved");	
	var isSolved = true;
	for (var i = 0; i < puzzleWord.length; i++) {
		console.log(i+": "+puzzleWord[i]+"==="+"_ ");
		if (puzzleWord[i] === "_ ") {
			return false;
		}
	}
	return isSolved;
}

// Function that returns true if user enters something that's not a letter.
//  Returns false otherwise.
function isALetter (n) {
	return (n >= 65 && n <= 90);
	// return (n >= 65 && n <= 90 || n >= 97 && n <= 122);
}

// Function that takes in the alphabet index of a valid userGuess and places the letter on the game board.
function guessLetter (index) {
console.log("guessLetter function");
	// check if letter is in word
	if (playableLetter(index)) {
console.log("letter is playable");
		puzzle.innerHTML= ""; // delete current puzzle
		printPuzzle();   // print updated puzzle
	}
	else {
console.log("letter not playable");
//		var wrongChar = alphabetArray[index];
		numWrongGuesses++;

		// add letter to the used-letters section of HTML
		var letter = document.createTextNode(" " + alphabetArray[index]);
		usedLetters.appendChild(letter);
	}	
	printArray(puzzleWord);

	//grey out letter tile/btn so the button cannot be used
	document.getElementById("btn"+alphabetArray[index]).disabled = true;
	letterGuessed[index] = true;
}

// Function that places the letter on the board and returns true if the letter is in the word.
//  Returns false otherwise.
function playableLetter(index) {
//console.log("puzzleWord[i] "+puzzleWord[i] ==)
	var letterInWord = false;
console.log("playableLetter function: check if letter is in word");
	// Loop through word to determing if letter exists. Update array with guessed letter.
	for (var i = 0; i < currentWord.length; i++) {
console.log(""+alphabetArray[index]+" === "+currentWord[i].toUpperCase());
		if (alphabetArray[index] === currentWord[i].toUpperCase()) {
console.log("true");
			currentScore += POINT_VALUE;
			puzzleWord[i] = alphabetArray[index] + " "; // update the puzzle board with letter
			letterInWord = true; //update flag with true
		}
		else
console.log("false");		
	}

	return letterInWord;
}

// function that takes in the button letter object and performs onClick
function selectLetter(ltr){
	ltr.disabled = "disabled";
	var index = ltr.innerHTML.charCodeAt(0)-65;
//console.log("index in select letter function is "+index);
	guessLetter(index); // guessLetter takes in index...so convert to index
	endGameCheck();
}

// Function to create/add alphabet buttons on DOM
function initAlphabetBtns() {
//<button class="btn btn-default" type="submit">Button</button>
	for(var i = 0; i < alphabetArray.length; i++) {
		var btn = document.createElement("button");
		btn.className = "btn btn-info btnLetter"
		btn.value = btn.innerHTML = alphabetArray[i];
		btn.id = "btn"+alphabetArray[i];
		btn.onclick = function(){selectLetter(this)};
		alphabetBtns.appendChild(btn);
	}
}


// Prints the puzzle by appending each value in array to html element
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

function printArray(arr){
	for (var i = 0; i < arr.length; i++) {
//	  console.log(arr[i]+"");
	}	
}