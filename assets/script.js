var questions = [];

var cardDisplay = document.querySelector("#cardDisplay");
var timerh1 = document.querySelector("#timer");
var viewScoresh1 = document.querySelector("#highscores");
var answerResultsUl = document.querySelector("#answerResults");

var currentQuestionIndex = 0;

// create and add a question to the questions array
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
    
    // assign any additional arguments to the answers array
    for (var i = 2; i < arguments.length; i++){
        question.answers[i-2] = arguments[i];
    }

    // return the populated question item
    questions.push(question);
}

// create an html section that represents a question and its options
function createQuestionCard(question){

    // create the actual card section
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


// creates a starting card to start the test at
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

// a card to display on quiz completion that allows
// user to submit their initials for score records
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
        timerh1.setAttribute("style", "visibility:hidden");
    });
    card.appendChild(a);

    return card;
}

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


// this makes the little gray answer-result boxes appear
function populateAnswerResults(){
    var answerResults = document.getElementById("answerResults");
    
    for (var i = 0; i < questions.length; i++)
    {
        var li = document.createElement("li");
        answerResults.appendChild(li);
    }
}

// function that is called when li(answer) is clicked
function answerQuestion(result){

    // change the color of the box in the answer tracker
    var li = document.querySelector("#answerResults").children[currentQuestionIndex];
    var color = result ? "green" : "red";
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

function outlineActiveQuestion(){
    var lis = document.querySelector("#answerResults").children;
    for (var i = 0; i < questions.length;  i++){
        if (currentQuestionIndex == i){
            lis[i].setAttribute("id", "current");
        }else{
            lis[i].removeAttribute("id");
        }
    }
}

// called to display the next question card
function showNextQuestion(){
    // create a new card based on the current question index
    card = createQuestionCard(questions[currentQuestionIndex]);

    changeCard(card);
}

function changeCard(card){
    // remove the last question card from the cardDisplay if one exists
    if (cardDisplay.children.length > 0){
        cardDisplay.children[0].remove();
    }
    // add the new card
    cardDisplay.appendChild(card);
}

// starts the test
function startTest(){
    currentQuestionIndex = 0; // ensure we are on the first question
    populateAnswerResults(); // show the gray answerboxes to track results
    showNextQuestion(); // kickoff the first question
    outlineActiveQuestion();

    // adjust visibilities in the header
    timerh1.setAttribute("style", "visibility:visible;");
}

function populateScores(ol){
    for (var i = 0; i < 3; i++){
        var li = document.createElement("li");
        li.textContent = `user ${i}`;
        ol.appendChild(li);
    }
}


// ---------------------------------- //


// populate the questions
addQuestion("How old are you?", 1, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");
addQuestion("How old are you?", 1, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");
addQuestion("How old are you?", 1, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");

// start off with a home-card and make the timer invisible
changeCard(createHomeCard());
timerh1.setAttribute("style", "visibility:hidden");
viewScoresh1.addEventListener("click", function(event) {
    event.preventDefault();
    viewScoresh1.setAttribute("style", "display:none;");
    changeCard(createHighScoresCard()); 
});
