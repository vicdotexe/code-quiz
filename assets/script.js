var questions = [];

function createQuestion(ask, correctIndex){
    var question = {}; // create the question object
    question.ask = ask; // assign the content of what the question is asking
    question.correctIndex = correctIndex; // assign the index of the correct answer
    question.answers = []; // create an array of possible answers

    // assign any additional arguments to the answers array
    for (var i = 2; i < arguments.length; i++){
        question.answers[i-2] = arguments[i];
    }

    // return the populated question item
    return question;
}