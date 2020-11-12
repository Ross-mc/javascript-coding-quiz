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

//stored scores

let scores = [];


//query selectors

const INIT_CONTAINER = document.querySelector("#init");
const BEGIN_BUTTON = document.querySelector("#start_quiz");
const USER_NAME_EL = document.querySelector("#name")

const QUIZ_CONTAINER = document.querySelector("#quiz");
const SCORE_CONTAINER = document.querySelector("#score");

const TIME_BAR_ELEMENT = document.querySelector("#time_bar");
const TIME_REMAINING_ELEMENT = document.querySelector("#time_label");


//variables

let timeBarValue = TIME_BAR_ELEMENT.value;
let timeRemaining = parseInt(TIME_REMAINING_ELEMENT.textContent)*1000;

let currentQuestionIndex = 0;
let userScore = 0;

//functions

function beginQuiz(event){
    event.preventDefault();

    currentQuestionIndex = 0;
    userScore = 0;  

    fadeOut(INIT_CONTAINER);
    createQuestion(currentQuestionIndex);
    createAnswers(currentQuestionIndex);
    updateScore();
    setTimeout(fadeIn, 600, QUIZ_CONTAINER);

    let timer = setInterval(function(){

        timeBarValue -= 20;
        TIME_BAR_ELEMENT.value = timeBarValue;        
        
        timeRemaining -= 20;
        if (timeRemaining % 1000 === 0){
            TIME_REMAINING_ELEMENT.textContent = timeRemaining / 1000;
        };

        if (timeBarValue === 0){
            clearInterval(timer);
        }
    }, 20);

};

function userGuess(event){
    if (event.target.matches("button")){
        let userClickedId = parseInt(event.target.getAttribute("data-index"));

        if (userClickedId === QUIZ[currentQuestionIndex].correctAnswerIndex){
            userScore++;
        } else{ 
            timeBarValue-= 5000;
            timeRemaining -= 5000;
            TIME_BAR_ELEMENT.value = timeBarValue;
            TIME_REMAINING_ELEMENT.textContent = Math.round(timeRemaining / 1000);
        };

        if (currentQuestionIndex === QUIZ.length-1){
            finishQuiz();
            return;

        }

        fadeOut(QUIZ_CONTAINER);

        currentQuestionIndex++;
        updateScore();



        setTimeout(function(){
            QUIZ_CONTAINER.innerHTML = "";
            fadeIn(QUIZ_CONTAINER);
            createQuestion(currentQuestionIndex);
            createAnswers(currentQuestionIndex);
        }, 600);
    };

    
}

function finishQuiz(){
    // Display for finishing the quiz
    fadeOut(QUIZ_CONTAINER);

    //reset the quiz
    QUIZ_CONTAINER.innerHTML = "";
    currentQuestionIndex = 0;

    //get scores from storage

    if (JSON.parse(localStorage.getItem("scoresArray") !== null)){
        scores = JSON.parse(localStorage.getItem("scoresArray"));
    };

    //save to localstorage
    let userInitials = USER_NAME_EL.value.toUpperCase().trim();
    USER_NAME_EL.value = "";
    let userObj = {
        user: userInitials,
        score: userScore
    };

    let hasObjBeenPushed = false;

    if (scores.length === 0){
        scores.push(userObj);
        hasObjBeenPushed = true
    } else{
        for (let i = 0; i<scores.length; i++){
            if (userObj.score > scores[i].score){
                scores.splice(i, 0, userObj);
                hasObjBeenPushed = true;
                break;
            }
        } if (!hasObjBeenPushed){
            scores.push(userObj);
        };
    };

    localStorage.setItem("scoresArray", JSON.stringify(scores));

    //create all the elements for finishing the quiz


    let finishedContainer = document.createElement("div");
    finishedContainer.setAttribute("class", "container");
    finishedContainer.setAttribute("id", "finished_quiz");
    document.body.appendChild(finishedContainer);

    let finishedHeader = document.createElement("h2");
    finishedHeader.textContent = "Finished"
    finishedContainer.appendChild(finishedHeader);

    let finishedPara = document.createElement("p");
    finishedPara.textContent = `Your score of ${userScore}/${QUIZ.length} has been added to the high scores!`;
    finishedContainer.appendChild(finishedPara);

    let viewScoresButton = document.createElement("button");
    viewScoresButton.setAttribute("type", "button");
    viewScoresButton.setAttribute("id", "view_scores");
    viewScoresButton.textContent = "View Highscores";
    finishedContainer.appendChild(viewScoresButton);

    let returnButton = document.createElement("button");
    returnButton.setAttribute("type", "button");
    returnButton.setAttribute("id", "view_scores");
    returnButton.textContent = "Return";
    finishedContainer.appendChild(returnButton);
    

    return;
}

function updateScore(){
    
    let currentScoreEl = document.querySelector("#score_para");
    currentScoreEl.textContent = `Current score: ${userScore}/${QUIZ.length}`;
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
    
    let numOfAnswers = QUIZ[currentQuestionIndex].possibleAnswers.length;

    for (let i = 0; i < numOfAnswers; i++){
        let answerButton = document.createElement("button");
        answerButton.setAttribute("type", "button");
        answerButton.setAttribute("data-index", i);
        let answer = QUIZ[currentQuestionIndex].possibleAnswers[i];
        answerButton.textContent = answer;
        QUIZ_CONTAINER.appendChild(answerButton); 
    };

};



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
    }, 10);
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
    }, 10);
};


//click listeners


BEGIN_BUTTON.addEventListener("click", beginQuiz);

QUIZ_CONTAINER.addEventListener("click", userGuess);


