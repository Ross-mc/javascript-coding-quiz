


// An array of questions, which are objects. The object has kvp of question, possible answers (an array) and the correct answer stored as an index

const QUIZ = [
    {
        question: "Test Question",
        possibleAnswers: ["a", "b", "c", "d"],
        correctAnswerIndex: 1
    },
    {
        question: "Test Question 2",
        possibleAnswers: ["1", "2", "3", "4"],
        correctAnswerIndex: 3
    },

];


//query selectors

const INIT_CONTAINER = document.querySelector("#init");
const BEGIN_BUTTON = document.querySelector("#start_quiz");

const QUIZ_CONTAINER = document.querySelector("#quiz")

const TIME_BAR_ELEMENT = document.querySelector("#time_bar");
const TIME_REMAINING_ELEMENT = document.querySelector("#time_label");

//variables

let timeBarValue = TIME_BAR_ELEMENT.value;
let timeRemaining = parseInt(TIME_REMAINING_ELEMENT.textContent)*1000;



//functions

function beginQuiz(){
    let  currentQuestionIndex = 0;


    fadeOut(INIT_CONTAINER);
    createQuestion(currentQuestionIndex);
    createAnswers(currentQuestionIndex);
    setTimeout(fadeIn, 600, QUIZ_CONTAINER);

    let timer = setInterval(function(){

        timeBarValue -= 20;
        TIME_BAR_ELEMENT.value = timeBarValue;        
        
        timeRemaining -= 20;
        if (timeRemaining % 1000 === 0){
            TIME_REMAINING_ELEMENT.textContent = timeRemaining / 1000;
        };

        if (timeBarValue === 0){
            clearInterval(timer)
        }
    }, 20);

}



function createQuestion(currentQuestionIndex){

    let quiz_header = document.createElement("h2");
    quiz_header.setAttribute("id", "quiz_header");
    quiz_header.textContent = "Question " + (currentQuestionIndex+1);

    QUIZ_CONTAINER.appendChild(quiz_header);

    let questionEl = document.createElement("p");
    questionEl.className = "question";
    questionEl.textContent = QUIZ[currentQuestionIndex].question;

    QUIZ_CONTAINER.appendChild(questionEl);
}

function createAnswers(currentQuestionIndex){
    
    let numOfAnswers = QUIZ[currentQuestionIndex].possibleAnswers.length

    for (let i = 0; i < numOfAnswers; i++){
        let answerButton = document.createElement("button");
        answerButton.setAttribute("type", "button");
        answerButton.setAttribute("data-index", i);
        let answer = QUIZ[currentQuestionIndex].possibleAnswers[i];
        answerButton.textContent = answer;
        QUIZ_CONTAINER.appendChild(answerButton);
        
    }
}



// fading functions

function fadeOut(element){
    var opacityValue = 1;

    var timer = setInterval(function(){
        if (opacityValue <=0.05){
            clearInterval(timer);
            element.style.display = 'none'
        }
        element.style.opacity = opacityValue;
        opacityValue -= opacityValue * 0.05
    }, 10)
};

function fadeIn(element){
    var opacityValue = 0;
    element.style.display = 'block'
    var timer = setInterval(function(){
        if (opacityValue >=1){
            clearInterval(timer);
            
        }
        element.style.opacity = opacityValue;
        if (opacityValue === 0){
            opacityValue += 0.05;
        } else{
            opacityValue += opacityValue * 0.05;
        }
    }, 10)
}


//click listeners


BEGIN_BUTTON.addEventListener("click", beginQuiz);


