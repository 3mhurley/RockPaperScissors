// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
var computerChoices = ["r", "p", "s"];

// Creating variables to hold the number of wins, losses, and ties. They start at 0.
var wins = 0;
var losses = 0;
var ties = 0;
var guessWinner = '';
var winningGuess = '';
// --------------------------------------------------------------

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDy13UA5pTzjs6JmVgwZDE47HdPEE047aI",
    authDomain: "rockpaperscissors-89b7a.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-89b7a.firebaseio.com",
    projectId: "rockpaperscissors-89b7a",
    storageBucket: "rockpaperscissors-89b7a.appspot.com",
    messagingSenderId: "58110657696"
};
firebase.initializeApp(config);
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
    // If they are connected..
    if (snap.val()) {
      // Add user to the connections list.
      var con = connectionsRef.push(true);
      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {
    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#connected-viewers").text("Viewers: " + snap.numChildren());
});

// --------------------------------------------------------------

// At the page load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the values within the firebase node bidderData changes
database.ref("/guesserData").on("value", function(snapshot) {
    // If Firebase has a highPrice and highBidder stored (first case)
    if (snapshot.child("guessWinner").exists() && snapshot.child("winningGuess").exists()) {
        // Set the local variables for highBidder equal to the stored values in firebase.
        guessWinner = snapshot.val().guessWinner;
        winningGuess = parseInt(snapshot.val().winningGuess);
        // change the HTML to reflect the newly updated local values (most recent information from firebase)
        $("#winning-guesser").text(snapshot.val().guessWinner);
        $("#winning-guess").text(snapshot.val().winningGuess + " won");
        // Print the local data to the console.
        console.log(snapshot.val().guessWinner);
        console.log(snapshot.val().winningGuess);
    }
    // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
    else {
        // Change the HTML to reflect the local value in firebase
        $("#winning-guesser").text(guessWinner);
        $("#winning-guess").text(winningGuess + " won");
        // Print the local data to the console.
        console.log("local Winner");
        console.log(guessWinner);
        console.log(winningGuess);
    }
// If any errors are experienced, log them to console.
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------

// Whenever a user clicks the button
$(".guess").on("click", function(event) {
    event.preventDefault();
    // Get the input values
    var guesserName = $("#guesser-name").val().trim();
    var guessVal = $(this).attr("guess-value");
    var result = rpsLogic(guessVal,winningGuess);
    // Log
    console.log(guesserName);
    console.log(guessVal);

    if (result === 'w') {
        // Alert
        alert("You win");
        // Save in Firebase
        database.ref("/guesserData").set({
            guessWinner: guesserName,
            winningGuess: guessVal
        });
        // Log the new High Price
        console.log("New Choice");
        console.log(guesserName);
        console.log(guessVal);
        // Store as a local variable (could have also used the Firebase variable)
        guessWinner = guesserName;
        winningGuess = guessVal;
        // Change the HTML to reflect
        $("#winning-guesser").text(guesserName);
        $("#winning-guess").text(guessVal);
    } else if (result === 't') {
        // Alert
        alert("It's a tie");
    } else if (result === 'l') {
        // Alert
        alert("You lose");
    } else {
        // Alert
        alert("No second player");
    }
});


function rpsLogic(userGuess,computerGuess) {
    if (computerGuess === "") {
        computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];
    }
    // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
    if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {
        if ((userGuess === "r" && computerGuess === "s") || (userGuess === "s" && computerGuess === "p") || (userGuess === "p" && computerGuess === "r")) {
            wins++;
            return 'w';
        } else if (userGuess === computerGuess) {
            ties++;
            return 't';
        } else {
            losses++;
            return 'l';
        }
    }
}