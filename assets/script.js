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
 * A class to contain all the aspects of a question.
 */
class Question {
    /**
     * @param {string} ask Question to be asked
     * @param {number} correctIndex The correct index of the answers
     * @param {string[]} answers An array of potential answers
     */
    constructor(ask, correctIndex, answers){
        this.ask = ask;
        this.correctIndex = correctIndex;
        this.answers = answers;
    }

    /**
     * Check an index for correctness.
     * @param {number} index The index of the question to check
     * @returns Whether the question index is correct or not
     */
    getResult(index){
        return index == this.correctIndex;
    }

    /**
     * Shuffle all the answers in this question.
     */
    shuffleAnswers(){
        var correctAnswer = this.answers[this.correctIndex];
        shuffleArray(this.answers);
        for(let i = 0; i < this.answers.length; i++){
            if (this.answers[i] == correctAnswer){
                this.correctIndex = i;
                break;
            }
        }
    }
}

/**
 * A class to represent the most basic "card" html element for this project.
 */
class Card {
    /**
     * 
     * @param {string} id Optional unique id for this card element
     * @param {string} title h1 text content of this card
     */
    constructor(id, title){
        this.element = document.createElement("section");
        if (id){
            this.element.id = id;
        }
        this.element.classList.add("card");
        this.h1 = document.createElement("h1");
        if (title){
            this.h1.textContent=title;
        }
        this.element.appendChild(this.h1);
        this.content = document.createElement("section");
        this.content.classList.add("cardContent");
        this.element.appendChild(this.content);
    }
}

/**
 * Shortcut to create a question and push it to the collection in one go.
 * @param {string} ask The question to be asked.
 * @param {int} correctIndex The zero based index of the correct answer
 * @param {Array} arguments An array of answers
 */
function addQuestion(ask, correctIndex, answers){
    
    questions.push(new Question(ask, correctIndex, answers));
}

/** 
 * Creates an html section that represents a question and its options.
 * @param {question} question The question object to be injected into the card.
 */
function createQuestionCard(question){

    var card = new Card("questionCard", question.ask);
    
    card.content.id = "answersSection"

    // create and add the possible answers to the list
    for(let i = 0; i < question.answers.length; i++){
        var button = document.createElement("button");
        button.textContent = question.answers[i];
        button.setAttribute("data-buttonFunction","answerQuestion");
        button.setAttribute("data-answerIndex", i);
        card.content.appendChild(button);
    }
    
    // return the html section element created
    return card;
}


/** 
 *  Creates an html section that will act as the home screen 
 */
function createHomeCard(){

    var card = new Card("homeCard","Coding Quiz Challenge");

    var p = document.createElement("p");
    p.textContent="Must complete the quiz within the time-limit to place a score. Your score will be the time remaining. Incorrect answers will reduce your remaining time left."
    card.content.appendChild(p);

    var button = document.createElement("button");
    button.setAttribute("data-buttonFunction", "startTest");
    button.textContent = "Start Test";

    card.element.appendChild(button);

    return card;
}

/**
 * Creates an html section to display on quiz completion that allows
 * user to submit their initials for score records 
 */
function createEndCard(){
    var card = new Card("endCard", "Quiz Complete!");
    card.element.setAttribute("id", "endCard");

    var h2 = document.createElement("h2");
    h2.textContent = `Score: ${timeLeft}`;
    card.element.appendChild(h2);

    var p = document.createElement("p");
    p.textContent = "Enter your initials to save your score.";
    card.element.appendChild(p);

    var input = document.createElement("input");
    input.setAttribute("id", "initials");
    input.setAttribute("type", "text");
    card.element.appendChild(input);

    var button = document.createElement("button");
    button.setAttribute("data-buttonFunction", "submitName");
    button.textContent = "Submit";
    card.element.appendChild(button);

    card.content.setAttribute("style", "display: none;");
    return card;
}

/**
 * Creates an html section for displaying the high scores 
 */
function createHighScoresCard(){
    var card = new Card("highscoreCard", "High Scores");
    card.element.setAttribute("id", "highscoreCard");

    var ul = document.createElement("ul");
    populateScores(ul);
    card.content.appendChild(ul);

    var button = document.createElement("button");
    button.setAttribute("data-buttonFunction", "goBack");
    button.innerText = "Go Back";
    card.element.appendChild(button);

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
    var nextQuestion = questions[currentQuestionIndex];
    //shuffleAnswers(nextQuestion);
    nextQuestion.shuffleAnswers();
    var card = createQuestionCard(nextQuestion); // create a new card based on the current question index
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
    cardDisplay.appendChild(card.element);
}

/**
 * Starts the test: shuffles the questions, resets current question index,
 * populates the answer-result boxes, and shows the first question card.
 */
function startTest(){
    elements.viewScoresh1.setAttribute("style", "visibility: hidden");
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

/** Ends the timer and hides the element*/
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
            elements.viewScoresh1.setAttribute("style", "visibility:visible");
            break;
        case "answerQuestion":
            var index = event.target.getAttribute("data-answerIndex");
            answerQuestion(questions[currentQuestionIndex].getResult(index));
            break;
        case "showHighscores":
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

/**
 * Function to wrap the process of adding all the question data
 */
 function populateQuestions(){
    // Populate the questions.
    addQuestion("Which JavaScript method is used to get a number as a string?", 2, ["intToString()", "parseInteger()", "toString()", "All of the above"]);

    addQuestion("Which is the correct syntax to call an external JavaScript file in the current HTML document?", 0, [`<script src="jsfile.js"></script>`, `<script href=" jsfile.js"></script>`, `<import src=" jsfile.js"></import>`, `<script link=" jsfile.js"></script>`]);

    addQuestion("JavaScript is the programming language of the _____.", 2, ["Desktop", "Mobile", "Web", "Server"]);

    addQuestion("Which symbol is used separate JavaScript statements?", 3, ["Comma (,)", "Colon (:)", "Hyphen (_)", "Semicolon (;)"]);

    addQuestion("Which JavaScript method is used to write on browser's console?", 3, ["console.write()", "console.output()", "console.writeHTML()", "console.log()"]);

    addQuestion("In JavaScript, single line comment begins with ___.", 3, ["#", "/*", "$", "//"]);

    addQuestion("In JavaScript, multi-line comments start with __ and end with ___.", 0, ["/* and */", "<!—and -->", "## and ##", "// and //"]);

    addQuestion("What is the default value of an uninitialized variable?", 0, ["undefined", "0", "null", "NaN"]);

    addQuestion("JavaScript arrays are written with _____.", 0, ["square brackets []", `double quotes ""`, "curly brackets {}", "round brackets ()"]);

    addQuestion("Which JavaScript operator is used to determine the type of a variable?", 0, ["typeof", "TypeOf", "typeOf", "sizeof"]);
}

// ------------------------------------------ //

// Fill the questions array
populateQuestions();

// Start off with a home-card
changeCard(createHomeCard());

// register the click handler
document.addEventListener("click", onClick);
