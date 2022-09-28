var questions = [];

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


addQuestion("How old are you?", 2, 10,34,18,19);
addQuestion("Dogs name?", 3, "Mowgli", "Lila", "Tommy", "Luna");
addQuestion("Favorite Vegetable", 1, "Potato", "Onion", "Carrot", "Cucumber");

console.log(questions);

var question = questions[0];
console.log(question.getResult(2));