// Initialize Firebase
var config = {
  apiKey: "AIzaSyB1W0IMfoux0deSPYb8SH0HjMJYCGniZfs",
  authDomain: "train-schedule-68354.firebaseapp.com",
  databaseURL: "https://train-schedule-68354.firebaseio.com",
  projectId: "train-schedule-68354",
  storageBucket: "train-schedule-68354.appspot.com",
  messagingSenderId: "509872510060"
};

firebase.initializeApp(config);

var database = firebase.database();

// Create button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = moment($("#first-train-input").val().trim(), "HH:mm").format("hh:mm A");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };

// Uploads train data to the database
database.ref().push(newTrain);

// Logs everything to console
console.log("new Train: " + newTrain.name);
console.log("new Train: " + newTrain.destination);
console.log("new Train: " + newTrain.start);
console.log("new Train: " + newTrain.frequency);

alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  // console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // First Time
  var trainStartConverted = moment(trainStart, "HH:mm"); 
  // console.log("trainStartConverted: " + trainStartConverted);

  // Current Time
  var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(trainStartConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  // console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainStart),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
var currentTime = moment();
$("#current-time").text(moment(currentTime).format("hh:mm A"));