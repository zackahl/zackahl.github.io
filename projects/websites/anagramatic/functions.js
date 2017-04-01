// Create game object
var gameObject = new Object();

// Allow user to press enter to check anagram
$("#userInput").keyup(function(event){
    if(event.keyCode == 13){
        $("#checkAnagram").click();
    }
});
// Allow user to press spacebar to load new word
    $("#userInput").keyup(function(event){
    if(event.keyCode == 32){
        $("#newWord").click();
        $('#userInput').val("")
    }
});

//--------- Access dictionary words on page load --------//
$( document ).ready(function() {
    $.get("https://raw.githubusercontent.com/dwyl/english-words/master/words.txt", function(data) {
        // Create array containing words
        var words = data.split("\n");
        var wordsArray = new Array();
        for(var i = 0; i < words.length; i++) {
            // Only add words of length [3-8] containing letters only
            if(words[i].length > 3 && words[i].length < 9 && /^[a-zA-Z]+$/.test(words[i])) { 
                wordsArray.push(words[i].toUpperCase());
            }
        }
        // Create gameObject propertys
        gameObject.dictionary = wordsArray;
        gameObject.userAnagrams = [];
        gameObject.score = 0;
        gameObject.bestScore = 0;

        // Set default values on page load
        $("#score").text("Score: " + gameObject.score);
        $("#countdown").text("Time: 1:00");
        $("#currentBestScore").text("0");

        // Create random word
        newWord();

        // Loading animation
        if(gameObject.currentWordLength > 0) {
            $('#loader').hide();
        }
    });
});

//--------- Generate a new random word ----------//
var newWord = function() {
    // Randomly output a new word
    var numRand = Math.floor((Math.random() * gameObject.dictionary.length) + 1);
    $("#randomWord").text(gameObject.dictionary[numRand]);

    // Create gameObject properties
    gameObject.currentWord = gameObject.dictionary[numRand];
    gameObject.currentWordLength = gameObject.currentWord.length;                       
};

//--------- Check user input is an anagram --------//
var checkAnagram = function() {

    // Seperate arrays for different length words
    var fourChars = [];
    var fiveChars = [];
    var sixChars = [];
    var sevenChars = [];
    var eightChars = [];

    // Push words into seperate arrays
    for(var i = 0; i < gameObject.dictionary.length; i++) {
        switch(gameObject.dictionary[i].length) {
            case 4:
                fourChars.push(gameObject.dictionary[i]);
                break;
            case 5:
                fiveChars.push(gameObject.dictionary[i]);
                break;
            case 6:
                sixChars.push(gameObject.dictionary[i]);
                break;
            case 7:
                sevenChars.push(gameObject.dictionary[i]);
                break;
            case 8:
                eightChars.push(gameObject.dictionary[i]);
                break;
        }
    };

    // Create user input variables
    var ui = $('#userInput').val().toUpperCase();
    var uiLength = ui.length;
    var abc = "";
    var valid = false;
    var duplicateChar = false;

    // Validate that only characters within the original word are used
    for(var a = 0; a < uiLength; a++) {
        for(var b = 0; b < gameObject.currentWordLength; b++) {
            if(ui[a] === gameObject.currentWord[b]) {

                abc += gameObject.currentWord[b];

                // If user input uses only the available characters
                if(ui === abc) {
                    valid = true;
                }

                // Count the number of each character in a word i.e how many a's there are
                var reg1 = new RegExp(ui[a],"g");
                var reg2 = new RegExp(gameObject.currentWord[b],"g");

                // If user input uses only the correct amount of each character
                if((ui.match(reg1).length <= gameObject.currentWord.match(reg2).length) === false) {
                    valid = false;
                    duplicateChar = true;
                    a = uiLength;
                }

                b = gameObject.currentWordLength;
            }
        }
    }

    // Clear messages
    $("#messages").text("");

    // Error validation
    $("#messages").removeClass("success");
    $("#messages").addClass("error");
    if(uiLength > 0) {
        // Too many of the same character
        if(duplicateChar === true) {
            $("#messages").text("You can only use the letters avaiable.");
            valid = false;  
        }
        // Invalid anagram
        else if(valid != true) {
            $("#messages").text("Anagram must only contain letters from the above word.");
        }
        // Anagram identical to origanl word
        else if(ui === gameObject.currentWord) {
            $("#messages").text("Anagram must differ from original word.");
            valid = false;    
        }
         // Anagram too long
        else if(uiLength > 8) {
            $("#messages").text("Anagram is too long.");
            valid = false; 
        }
        //Anagram too short
        else if(uiLength < 4) {
            $("#messages").text("Anagram is too short.");
            valid = false; 
        }
        // Anagram already used
        for(var c = 0; c <= gameObject.userAnagrams.length; c++) {
            if(ui === gameObject.userAnagrams[c]) {
                $("#messages").text(ui + " has already been used.");
                valid = false;
            }
        }
    }
    else {
        // No user input
        $("#messages").text("No anagram entered.");
        valid = false;   
    }

    // If valid characters then validate anagram exists
    if(valid) {
        var points = 0;
        // Assign points to complexity of anagram
        switch(uiLength) {
            case 4:
                if(fourChars.indexOf(ui) >= 0) {
                    points = 1;  
                    gameObject.userAnagrams.push(ui);
                }
                break;
            case 5:
                if(fiveChars.indexOf(ui) >= 0) {
                    points = 2; 
                    gameObject.userAnagrams.push(ui);
                }
                break;
            case 6:
                if(sixChars.indexOf(ui) >= 0) {
                    points = 3;  
                    gameObject.userAnagrams.push(ui);
                }
                break;
            case 7:
                if(sevenChars.indexOf(ui) >= 0) {
                    points = 4;  
                    gameObject.userAnagrams.push(ui);
                }
                break;
            case 8:
                if(eightChars.indexOf(ui) >= 0) {
                    points = 5;  
                    gameObject.userAnagrams.push(ui);
                }
                break;                    
        }

        // Display points
        if(points > 0) {
            $("#messages").removeClass("error");
            $("#messages").addClass("success");
            $("#messages").text(ui + " + " + points);
            // Load new word
            newWord();
        }
        else {
            $("#messages").text("Not a valid anagram.");  
        }

        // Add to and display total score
        gameObject.score += points;
        $("#score").text("Score: " + gameObject.score);
    }

    // Display user's list of anagrams
    $("#anagrams").text(gameObject.userAnagrams.join(', '));   

    // Display message
    $('#messages').fadeIn('fast');
    setTimeout(function() {
        $('#messages').fadeOut('fast');
    }, 2000);

    // Clear user input on click
    $('#userInput').val("");
};

// Create countdown object
var countdownObj = new Object();

//--------- Start new game ---------//
var startGame = function() {

    // Clear variables
    gameObject.score = 0;
    $("#score").text("Score: " + gameObject.score);
    gameObject.userAnagrams = [];
    $("#anagrams").text(gameObject.userAnagrams);
    newWord();

    // Set game countdown
    countdownObj.time = 60;
    countdownObj.duration = moment.duration(countdownObj.time, 'seconds');
    countdownObj.interval = 1000;
    countdownObj.countdown = setInterval(function() {
        countdownObj.duration = moment.duration(countdownObj.duration.asMilliseconds() - countdownObj.interval, 'milliseconds');
        // Display the timer
        $('#countdown').text("Time: " + moment(countdownObj.duration.asMilliseconds()).format('m:ss'));
        // Gameover message
        if(countdownObj.duration.asSeconds() === 0) {
            $('#randomWord').text("GAME OVER!");
            clearInterval(countdownObj.countdown);

            // Display best score
            if(gameObject.score > gameObject.bestScore) {
                gameObject.bestScore = gameObject.score;    
            }
            $('#currentBestScore').text(gameObject.bestScore);

        }
    }, countdownObj.interval); 

    // Toggle end game button
    $('#startGame').hide();
    $('#endGame').show();
}

//--------- End current game ---------//
var endGame = function() {

    // Clear the countdown
    clearInterval(countdownObj.countdown);

    // Clear variables
    gameObject.score = 0;
    $("#score").text("Score: " + gameObject.score);
    gameObject.userAnagrams = [];
    $("#anagrams").text(gameObject.userAnagrams);

    // Reset timer to 1 minute
    $('#countdown').text("Time: 1:00");

    // Toggle new game button
    $('#startGame').show();
    $('#endGame').hide();
} 