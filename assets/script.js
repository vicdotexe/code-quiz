var questions = [];
var cardDisplay = document.querySelector("#cardDisplay");

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
    card.setAttribute("id","questionCard");
    
    // create an h1 to display the actual question being asked
    var h1 = document.createElement("h1");
    h1.textContent = question.ask;
    card.appendChild(h1);

    // create a list
    var ol = document.createElement("ol");
    card.appendChild(ol);

    // create and add the possible answers to the list
    for(var i = 0; i < question.answers.length; i++){
        var li = document.createElement("li");
        li.textContent = question.answers[i];
        ol.appendChild(li);
    }
    
    // return the html section element created
    return card;
}


addQuestion("How old are you?", 2, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");


var card = createQuestionCard(questions[0], 0);
cardDisplay.appendChild(card);