/* Static elements for easy access */
var elements = {
    cardDisplay: document.querySelector("#cardDisplay"),
    timerh1: document.querySelector("#timer"),
    viewScoresh1: document.querySelector("#highscores"),
    answerResultsOl: document.querySelector("#answerResults")
}

var questions = [];
var currentQuestionIndex = 0;

/* Creates and adds a question object to the questions array. */
function addQuestion(ask, correctIndex){

    // create the question object
    var question = {
        // function that returns whether an answer was correct or not for this question
        getResult: function (answer){
            return answer == this.correctIndex;
        }
    };
    question.ask = ask; // assign the content of what the question is asking
    question.correctIndex = correctIndex; // assign the index of the correct answer
    question.answers = []; // create an array of possible answers
    
    // assign any additional arguments as answers
    for (var i = 2; i < arguments.length; i++){
        question.answers[i-2] = arguments[i];
    }

    // return the populated question item
    questions.push(question);
}

/* Creates an html section that represents a question and its options. */
function createQuestionCard(question){

    // create the section with a card class
    var card = document.createElement("section");
    card.setAttribute("class","card questionCard");
    
    // create an h1 to display the actual question being asked
    var h1 = document.createElement("h1");
    h1.textContent = question.ask;
    card.appendChild(h1);

    // create a section for answers
    var answersSection = document.createElement("section");
    answersSection.setAttribute("id", "answersSection");
    card.appendChild(answersSection);

    // create and add the possible answers to the list
    for(let i = 0; i < question.answers.length; i++){
        var a = document.createElement("a");
        a.textContent = question.answers[i];
        a.setAttribute("class", "answerOption button");
        a.setAttribute("href", "#");
        a.addEventListener("click", function(event){
            event.preventDefault();
            answerQuestion(question.getResult(i));}
            );
        answersSection.appendChild(a);
    }
    
    // return the html section element created
    return card;
}


// Creates an html section to start the test at.
function createHomeCard(){
    var card = document.createElement("section");
    card.setAttribute("class", "card");
    card.setAttribute("id", "homeCard");

    var h1 = document.createElement("h1");
    h1.textContent = "Coding Quiz Challenge";
    card.appendChild(h1);

    var p = document.createElement("p");
    p.textContent="Must complete the quiz within the time-limit to place a score. Your score will be the time remaining."
    card.appendChild(p);

    var a = document.createElement("a");
    a.setAttribute("class", "button")
    a.setAttribute("href", "#");
    a.textContent = "Start Test";
    a.addEventListener("click", function(event){
        event.preventDefault();
        startTest();
    });

    card.appendChild(a);

    return card;
}

/* Creates an html section to display on quiz completion that allows
    user to submit their initials for score records */
function createEndCard(){
    var card = document.createElement("section");
    card.setAttribute("class", "card");
    card.setAttribute("id", "endCard");

    var h1 = document.createElement("h1");
    h1.textContent = "Quiz Complete!";
    card.appendChild(h1);

    var p = document.createElement("p");
    p.textContent = "Enter your initials to save your score.";
    card.appendChild(p);

    var input = document.createElement("input");
    input.setAttribute("id", "initials");
    input.setAttribute("type", "text");
    card.appendChild(input);

    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("class", "button");
    a.textContent = "Submit";
    a.addEventListener("click", function(event){
        event.preventDefault();
        changeCard(createHomeCard());
        var ul = document.getElementById("answerResults");
        ul.innerHTML="";
        elements.timerh1.setAttribute("style", "visibility:hidden");
    });
    card.appendChild(a);

    return card;
}

/* Creates an html section for displaying the high scores */
function createHighScoresCard(){
    var card = document.createElement("section");
    card.setAttribute("class", "card");
    card.setAttribute("id", "highscoresCard");

    var h1 = document.createElement("h1");
    h1.textContent = "High Scores";
    card.appendChild(h1);

    var ol = document.createElement("ol");
    populateScores(ol);
    card.appendChild(ol);

    var a = document.createElement("a");
    a.setAttribute("class", "button");
    a.setAttribute("href", "#");
    a.innerText = "Go Back";
    a.addEventListener("click", function(event){
        event.preventDefault();
        changeCard(createHomeCard()); 
    });
    card.appendChild(a);

    return card;
}


/* This makes the little gray answer-result boxes appear */
function populateAnswerResults(){
    for (var i = 0; i < questions.length; i++)
    {
        var li = document.createElement("li");
        elements.answerResultsOl.appendChild(li);
    }
}

/* Processes the action of clicking an answer */
function answerQuestion(result){

    // change the color of the box in the answer tracker
    var li = document.querySelector("#answerResults").children[currentQuestionIndex];
    var color = result ? "rgb(138, 202, 181)" : "rgb(202, 159, 138)";
    li.setAttribute("style", `background-color:${color};`)
    

    currentQuestionIndex++; // track our questions count
    outlineActiveQuestion();
    // if our current index is more than the amount of question
    // then we have reached the end of the test, otherwise show next question
    if (currentQuestionIndex >= questions.length){
        changeCard(createEndCard());
    }else{
        showNextQuestion();
    }
}

/* Iterates through the answer-result boxes to apply a unique id
    to the box associated with the current question. */
function outlineActiveQuestion(){
    var lis = elements.answerResultsOl.children;
    for (var i = 0; i < questions.length;  i++){
        if (currentQuestionIndex == i){
            lis[i].setAttribute("id", "current");
        }else{
            lis[i].removeAttribute("id");
        }
    }
}

/* Creates and shows the next question card */
function showNextQuestion(){
    card = createQuestionCard(questions[currentQuestionIndex]); // create a new card based on the current question index
    changeCard(card);
}

/* Changes the the current card */
function changeCard(card){
    // remove the last card from the cardDisplay if one exists
    if (cardDisplay.children.length > 0){
        cardDisplay.children[0].remove();
    }
    // add the new card
    cardDisplay.appendChild(card);
}

/* Starts the test */
function startTest(){
    currentQuestionIndex = 0; // ensure we are on the first question
    populateAnswerResults(); // show the gray answerboxes to track results
    showNextQuestion(); // kickoff the first question
    outlineActiveQuestion();

    // adjust visibilities in the header
    elements.timerh1.setAttribute("style", "visibility:visible;");
}

/* Populates the scoreboard */
function populateScores(ol){
    for (var i = 0; i < 3; i++){
        var li = document.createElement("li");
        li.textContent = `user ${i}`;
        ol.appendChild(li);
    }
}


// ---------------------------------- //


// Populate the questions.
addQuestion("How old are you?", 1, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");
addQuestion("How old are you?", 1, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");
addQuestion("How old are you?", 1, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");

// Start off with a home-card and make sure the timer is invisible.
changeCard(createHomeCard());
elements.timerh1.setAttribute("style", "visibility:hidden");

// Give functionality to clicking on 'view highscores'.
elements.viewScoresh1.addEventListener("click", function(event) {
    event.preventDefault();
    changeCard(createHighScoresCard()); 
});
