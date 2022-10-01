/* Static elements for easy access */
var elements = {
    cardDisplay: document.querySelector("#cardDisplay"),
    timerh1: document.querySelector("#timer"),
    viewScoresh1: document.querySelector("#highscores"),
    answerResultsOl: document.querySelector("#answerResults"),
    costh3: document.querySelector("#cost")
}

var questions = [];
var currentQuestionIndex = 0;
var timer;
var timeLeft;
var testTime = 60;
var cost = 10;

/**
 * Creates and adds a question object to the questions object.
 * @param {string} ask The question to be asked.
 * @param {int} correctIndex The zero based index of the correct answer
 * @param {...string} arguments Any adittional arguments will be treated as potential answers.
 */
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

/** 
 * Creates an html section that represents a question and its options.
 * @param {question} question The question object to be injected into the card.
 */
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
        var a = document.createElement("button");
        a.textContent = question.answers[i];
        a.setAttribute("data-buttonFunction","answerQuestion");
        a.setAttribute("data-answerIndex", i);
        answersSection.appendChild(a);
    }
    
    // return the html section element created
    return card;
}


/** 
 *  Creates an html section that will act as the home screen 
 */
function createHomeCard(){
    var card = document.createElement("section");
    card.setAttribute("class", "card");
    card.setAttribute("id", "homeCard");

    var h1 = document.createElement("h1");
    h1.textContent = "Coding Quiz Challenge";
    card.appendChild(h1);

    var p = document.createElement("p");
    p.textContent="Must complete the quiz within the time-limit to place a score. Your score will be the time remaining. Incorrect answers will reduce your remaining time left."
    card.appendChild(p);

    var a = document.createElement("button");
    a.setAttribute("data-buttonFunction", "startTest");
    a.textContent = "Start Test";

    card.appendChild(a);

    return card;
}

/**
 * Creates an html section to display on quiz completion that allows
 * user to submit their initials for score records 
 */
function createEndCard(){
    var card = document.createElement("section");
    card.setAttribute("class", "card");
    card.setAttribute("id", "endCard");

    var h1 = document.createElement("h1");
    h1.textContent = "Quiz Complete!";
    card.appendChild(h1);

    var h2 = document.createElement("h2");
    h2.textContent = `Score: ${timeLeft}`;
    card.appendChild(h2);

    var p = document.createElement("p");
    p.textContent = "Enter your initials to save your score.";
    card.appendChild(p);

    var input = document.createElement("input");
    input.setAttribute("id", "initials");
    input.setAttribute("type", "text");
    card.appendChild(input);

    var a = document.createElement("button");
    a.setAttribute("data-buttonFunction", "submitName");
    a.textContent = "Submit";
    card.appendChild(a);

    return card;
}

/**
 * Creates an html section for displaying the high scores 
 */
function createHighScoresCard(){
    var card = document.createElement("section");
    card.setAttribute("class", "card");
    card.setAttribute("id", "highscoresCard");

    var h1 = document.createElement("h1");
    h1.textContent = "High Scores";
    card.appendChild(h1);

    var ul = document.createElement("ul");
    populateScores(ul);
    card.appendChild(ul);

    var a = document.createElement("button");
    a.setAttribute("data-buttonFunction", "goBack");
    a.innerText = "Go Back";
    card.appendChild(a);

    return card;
}



/* This makes the little gray answer-result boxes appear */
function populateAnswerResults(){
    elements.answerResultsOl.setAttribute("style", "visibility: visible");
    elements.answerResultsOl.innerHTML = "";
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
    
    // if it was answered incorrectly then our time is penalized
    if (!result){
        timeLeft -= cost;
        flashCost(); // display the time reduction to the user
        
        if (timeLeft <= 0){ // negative scores are no fun
            timeLeft = 0;
        }
        elements.timerh1.textContent = timeLeft;

        // if we ran out of time then the quiz ends
        if (timeLeft <= 0){
            timeLeft = 0;
            changeCard(createEndCard());
            endTimer();
            return;
        }
    }

    // if our current index is at the end, then we have reached the end of the test, otherwise show next question
    if (currentQuestionIndex == questions.length - 1 || timeLeft <=0){
        changeCard(createEndCard());
        endTimer();
    }else{
        showNextQuestion();
    }
}

/* Creates and shows the next question card */
function showNextQuestion(){
    currentQuestionIndex++; // advance the question index
    outlineActiveQuestion(); // outline it in our tracker
    card = createQuestionCard(questions[currentQuestionIndex]); // create a new card based on the current question index
    changeCard(card);
}

/**
 * Iterates through the answer-result boxes to apply a unique id
 * to the box associated with the current question. 
 */
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


/**
* Swaps out the current card element.
* @param {Element} card element to inject into the card display element.
*/
function changeCard(card){
    // clear the card display
    cardDisplay.innerHTML = "";
    // add the new card
    cardDisplay.appendChild(card);
}

/**
 * Starts the test: shuffles the questions, resets current question index,
 * populates the answer-result boxes, and shows the first question card.
 */
function startTest(){
    shuffleArray(questions); 
    populateAnswerResults(); // show the gray answerboxes to track results
    outlineActiveQuestion();
    currentQuestionIndex = -1; // set the index to -1 so we can just reuse 'showNexQuestion()'
    showNextQuestion(); // kickoff the first question
    startTimer();
}

/**
 * Populates a the score list element with scores from local storage.
 * @param {Element} ul The list element to add the scores to as <li> elements.
 */
function populateScores(ul){
    var scores = JSON.parse(localStorage.getItem("scores"));
    if (scores == null){
        return;
    }
    scores = scores.sort((s1,s2)=> {
        if (s1.score > s2.score)
        return -1;
        else
        return 1;
    });
    
    for (var i = 0; i < scores.length; i++){
        if (i==5){
            break;
        }
        var li = document.createElement("li");
        li.textContent = `${scores[i].score} - ${scores[i].name}`;
        ul.appendChild(li);
    }
}

/** Resets and starts the timer and makes it visible */
function startTimer(){
    elements.timerh1.setAttribute("style", "visibility: visible;")
    timeLeft = testTime;
    elements.timerh1.innerText = `${timeLeft}`;
    timer = setInterval(onTimerTick, 1000);
}

/* Subtracts time and handles running out of time. */
function onTimerTick(){
    timeLeft--;
    
    if (timeLeft <= 0){
        timeLeft = 0;
        changeCard(createEndCard());
        endTimer();
    }
    elements.timerh1.innerText = `${timeLeft}`;
}

/** Ends the timers and  */
function endTimer(){
    elements.timerh1.setAttribute("style", "visibility: hidden;");
    clearInterval(timer);
}

/**
 *  Randomize array in-place using Durstenfeld shuffle algorithm 
 * @param {Array} array The array to be shuffled.
 * */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/** Flashes the time penalty element to the user */
function flashCost(){
    elements.costh3.setAttribute("style", "visibility: visible");
    setTimeout(() => {
        elements.costh3.setAttribute("style", "visibility: hidden");
    }, 750);
}

/** Saves the current score to local storage */
function saveScore(name, score){
    var scores = JSON.parse(localStorage.getItem("scores"));
    if (scores == null){
        scores = [];
    }
    scores.push({
        score: score, 
        name: name
    });
    
    localStorage.setItem("scores", JSON.stringify(scores));
}

/** Catch-all for button clicks */
function onClick(event){
    var bFunc = event.target.getAttribute("data-buttonFunction");

    if (!bFunc){
        return;
    }
    event.preventDefault();

    
    switch (bFunc){
        case "startTest":
            startTest();
            break;
        case "submitName":
            var input = document.querySelector("#initials");
            changeCard(createHomeCard());
            endTimer(true);
            elements.answerResultsOl.setAttribute("style", "visibility: hidden");
            saveScore(input.value ? input.value : "???", timeLeft);
            break;
        case "answerQuestion":
            var index = event.target.getAttribute("data-answerIndex");
            answerQuestion(questions[currentQuestionIndex].getResult(index));
            break;
        case "showhighscores":
            changeCard(createHighScoresCard());
            elements.answerResultsOl.innerHTML="";
            elements.viewScoresh1.setAttribute("style", "visibility: hidden");
            elements.answerResultsOl.setAttribute("style", "visibility: hidden");
            endTimer(true);
            break;
        case "goBack":
            changeCard(createHomeCard());
            elements.viewScoresh1.setAttribute("style", "visibility:visible");
            break;
    }

}

// ---------------------------------- //


// Populate the questions.
addQuestion("Which JavaScript method is used to get a number as a string?", 
2, 
"intToString()",
"parseInteger()",
"toString()",
"All of the above");

addQuestion("Which is the correct syntax to call an external JavaScript file in the current HTML document?", 
0, 
`<script src="jsfile.js"></script>`,
`<script href=" jsfile.js"></script>`,
`<import src=" jsfile.js"></import>`,
`<script link=" jsfile.js"></script>`);

addQuestion("JavaScript is the programming language of the _____.", 
2, 
"Desktop",
"Mobile",
"Web",
"Server");

addQuestion("Which symbol is used separate JavaScript statements?", 
3, 
"Comma (,)",
"Colon (:)",
"Hyphen (_)",
"Semicolon (;)");

addQuestion("Which JavaScript method is used to write on browser's console?", 
3, 
"console.write()",
"console.output()",
"console.writeHTML()",
"console.log()");

addQuestion("In JavaScript, single line comment begins with ___.", 
3, 
"#",
"/*",
"$",
"//");

addQuestion("In JavaScript, multi-line comments start with __ and end with ___.", 
0, 
"/* and */",
"<!—and -->",
"## and ##",
"// and //");

addQuestion("What is the default value of an uninitialized variable?", 
0, 
"undefined",
"0",
"null",
"NaN");

addQuestion("JavaScript arrays are written with _____.", 
0, 
"square brackets []",
`double quotes ""`,
"curly brackets {}",
"round brackets ()");

addQuestion("Which JavaScript operator is used to determine the type of a variable?", 
0, 
"typeof",
"TypeOf",
"typeOf",
"sizeof");

// ------------------------------------------ //

// Start off with a home-card
changeCard(createHomeCard());

// register the click handler
document.addEventListener("click", onClick);
