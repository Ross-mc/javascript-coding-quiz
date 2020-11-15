// An array of questions, which are objects. The object has kvp of question, possible answers (an array) and the correct answer stored as an index

const QUIZ = [
    {
        question: "Inside which HTML element do we put JavaScript or reference a JavaScript file?",
        possibleAnswers: ["<javascript>", "<scripting>", "<js>", "<script>"],
        correctAnswerIndex: 3
    },
    {
        question: "Which of these is NOT a JavaScript datatype?",
        possibleAnswers: ["Number", "Boolean", "String", "Float"],
        correctAnswerIndex: 3
    },
    {
        question: "Which of these methods would display a message to the user?",
        possibleAnswers: ["confirm()", "prompt()", "alert()", "console.log()"],
        correctAnswerIndex: 2
    },
    {
        question: "Using JavaScript, if I added the String \"1\" to the Number 1, what would my result be?",
        possibleAnswers: ["\"11\"", "11", "2", "\"2\""],
        correctAnswerIndex: 0
    },
    {
        question: "Using JavaScript, if I added the Number 0.1 to the Number 0.2, what would my result be?",
        possibleAnswers: ["\"0.21\"", "0.3", "0.30000000000000004", "\"0.3\""],
        correctAnswerIndex: 2
    },
    {
        question: "When a function is a property of an Object, it is properly known as a ...?",
        possibleAnswers: ["object.function", "method", "property.function", "functionalObject"],
        correctAnswerIndex: 1
    },
    {
        question: "Which of these is NOT used for variable declaration in JavaScript?",
        possibleAnswers: ["var", "let", "init", "const"],
        correctAnswerIndex: 2
    },
    {
        question: "How would you reference the second element, in an Array called myArr which is a property of the Object myObj?",
        possibleAnswers: ["myObj[myArr].2", "myObj.myArr[1]", "myObj[myArr].1", "myObj.myArr[2]"],
        correctAnswerIndex: 1
    },
    {
        question: "JavaScript uses comparison operators. One such operator is \"===\". What does this mean?",
        possibleAnswers: ["It assigns a value to a variable", "It checks if two variables are not equal", "It checks whether two variables are strictly equal", "It checks whether two variables are loosely equal"],
        correctAnswerIndex: 2
    },
    {
        question: "Which of these would return true?",
        possibleAnswers: ["0 == false", "1<0", "!true", "false !== false"],
        correctAnswerIndex: 0
    },


];

//stored scores

let scores = [];


//query selectors

const INIT_CONTAINER = document.querySelector("#init");
const BEGIN_BUTTON = document.querySelector("#start_quiz");
const USER_NAME_EL = document.querySelector("#name");

const QUIZ_CONTAINER = document.querySelector("#quiz");
const SCORE_CONTAINER = document.querySelector("#score");
const PROGRESS_DIV = document.querySelector(".progress");

const TIME_BAR_ELEMENT = document.querySelector("#time_bar");
const TIME_REMAINING_ELEMENT = document.querySelector("#time_label");

let returnBtn;


//variables

let timeBarValue = TIME_BAR_ELEMENT.value;
const STORED_TIME_VALUE = timeBarValue;
let timeRemaining = parseInt(TIME_REMAINING_ELEMENT.textContent)*1000;

let currentQuestionIndex = 0;
let userScore = 0;

var timer;

var cleared = false;

//functions

function beginQuiz(event){
    event.preventDefault();

    if (USER_NAME_EL.value.length === 0 || USER_NAME_EL.value.length > 4){
        alert('Please enter your initials (maximum of 4 characters)');
        return;
    }

    currentQuestionIndex = 0;
    userScore = 0;  

    fadeOut(INIT_CONTAINER);
    createQuestion(currentQuestionIndex);
    createAnswers(currentQuestionIndex);
    updateScore();
    setTimeout(fadeIn, 600, QUIZ_CONTAINER);
    setTimeout(fadeIn, 600, SCORE_CONTAINER);

    timer = setInterval(function(){

        timeBarValue -= 20;
        TIME_BAR_ELEMENT.value = timeBarValue;      
        
        timeRemaining -= 20;
        if (timeRemaining % 1000 === 0){
            TIME_REMAINING_ELEMENT.textContent = timeRemaining / 1000;
        };

        if (timeBarValue <= 0){
            clearInterval(timer);
            finishQuiz(timeBarValue);
        }
    }, 20);

};

function userGuess(event){
    if (event.target.matches("button")){
        let userClickedId = parseInt(event.target.getAttribute("data-index"));

        scoreParaEl = document.querySelector("#score_para")

        if (userClickedId === QUIZ[currentQuestionIndex].correctAnswerIndex){
            userScore++;
            scoreParaEl.style.color = "#009432";
            setTimeout(function(){
                scoreParaEl.style.color = "black";
            }, 600)

        } else if (timeBarValue > 10000){ 
            timeBarValue-= 10000;
            timeRemaining -= 10000;
            TIME_BAR_ELEMENT.value = timeBarValue;
            TIME_REMAINING_ELEMENT.textContent = Math.round(timeRemaining / 1000);
            scoreParaEl.style.color = "#EA2027";
            setTimeout(function(){
                scoreParaEl.style.color = "black";
            }, 600)
        } else{
            timeBarValue = 0;
            timeRemaining = 0;
            TIME_BAR_ELEMENT.value = timeBarValue;
            TIME_REMAINING_ELEMENT.textContent = timeRemaining;
            scoreParaEl.style.color = "#EA2027";
            setTimeout(function(){
                scoreParaEl.style.color = "black";
            }, 600)
        };

        if (currentQuestionIndex === QUIZ.length-1){
            updateScore();
            finishQuiz();
            return;
        };

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

function finishQuiz(timeBarValue){
    // Display for finishing the quiz
    fadeOut(QUIZ_CONTAINER);
    clearInterval(timer);

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
    finishedHeader.textContent = "Quiz Finished!"
    finishedContainer.appendChild(finishedHeader);

    if (timeBarValue <= 0){
        finishedHeader.textContent = "You ran out of time!"
    }

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
    returnButton.setAttribute("class", "return");
    returnButton.textContent = "Return";
    finishedContainer.appendChild(returnButton);
    

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

function viewScores(){
    fadeOut(SCORE_CONTAINER);
    fadeOut(PROGRESS_DIV);
    let finished = document.getElementById("finished_quiz");
    finished.remove();
    cleared = false;

    //creating a highscores table

    let tableEl = document.createElement("table");
    tableEl.setAttribute("id", "high_scores_table");

    //creating the header

    let tableHead = document.createElement("thead");
    let tableRow = document.createElement("tr");
    let subHead = document.createElement("th");
    subHead.setAttribute("colspan", "2");
    subHead.textContent = "Highscores";
    tableRow.appendChild(subHead);
    tableHead.appendChild(tableRow);

    tableEl.appendChild(tableHead);


    //creating the body

    let tableBody = document.createElement("tbody");
    let tableData = document.createElement("td");
    let bodyRow = document.createElement("tr")
    tableData.textContent = "Player";
    bodyRow.appendChild(tableData);
    tableData = document.createElement("td");
    tableData.textContent = "Score";
    bodyRow.appendChild(tableData);
    tableBody.appendChild(bodyRow);

    for (let i = 0; i<scores.length && i<10; i++){
        let tableRow = document.createElement("tr");
        let userEl = document.createElement("td");
        userEl.textContent = `${i+1}: ${scores[i].user}`;
        tableRow.appendChild(userEl);
        let scoresEl = document.createElement("td");
        scoresEl.textContent = scores[i].score;
        tableRow.appendChild(scoresEl);
        tableBody.appendChild(tableRow);
    }

    let returnButton = document.createElement("button");
    returnButton.setAttribute("type", "button");
    returnButton.setAttribute("class", "return");
    returnButton.setAttribute("id", "return_btn");
    returnButton.textContent = "Return";

    let clearButton = document.createElement("button");
    clearButton.setAttribute("type", "button");
    clearButton.setAttribute("class", "clear");
    clearButton.setAttribute("id", "clear_btn");
    clearButton.textContent = "Clear Highscores";

    tableEl.appendChild(tableBody);
    
    document.body.appendChild(tableEl);
    document.body.appendChild(returnButton);
    document.body.appendChild(clearButton);

}

function returnHome(){
    fadeOut(SCORE_CONTAINER);
    fadeOut(PROGRESS_DIV);
    let finished = document.getElementById("finished_quiz");
    if (finished){
        finished.remove();
    };
    let clearButton = document.querySelector("#clear_btn");
    let returnButton = document.querySelector("#return_btn");

    let table = document.querySelector("#high_scores_table");
    if (table){
        table.remove();
        returnButton.remove();
        clearButton.remove();
    };

    if (cleared){
        returnButton.remove();
    }



    setTimeout(fadeIn, 600, INIT_CONTAINER);

    timeBarValue = STORED_TIME_VALUE;
    timeRemaining = STORED_TIME_VALUE;

    TIME_BAR_ELEMENT.value = timeBarValue;
    TIME_REMAINING_ELEMENT.textContent = timeRemaining/1000;
    setTimeout(fadeIn, 600, PROGRESS_DIV);
};

function clearScores(){
    let table = document.querySelector("#high_scores_table");
    table.remove();
    localStorage.clear();
    let clearButton = document.querySelector("#clear_btn");
    clearButton.remove();
    cleared = true;
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


//for dynamically created elements
document.addEventListener("click", function(event){
    if (event.target && event.target.id === "view_scores"){
        viewScores();
    } else if (event.target && event.target.className === "return"){
        returnHome();
    } else if (event.target && event.target.className === "clear"){
        clearScores();
    }
});




