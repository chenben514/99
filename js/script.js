//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");


const TIME_VALUE = 60;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

// if startQuiz button clicked
start_btn.onclick = () => {
    quiz_box.classList.add("activeQuiz"); //show quiz box
    getQuestions();
    showQuetions(0); //calling showQestions function
    queCounter(1); //passing 1 parameter to queCounter
    startTimer(TIME_VALUE); //calling startTimer function
    startTimerLine(0); //calling startTimerLine function
}

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz"); //show quiz box
    result_box.classList.remove("activeResult"); //hide result box
    timeValue = TIME_VALUE;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(timeValue); //calling startTimer function
    startTimerLine(widthValue); //calling startTimerLine function
    timeText.textContent = "還剩"; //change the text of timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
}

// if quitQuiz button clicked
quit_quiz.onclick = () => {
    window.location.reload(); //reload the current window
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
    if (que_count < questions.length - 1) { //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_numb value
        showQuetions(que_count); //calling showQestions function
        queCounter(que_numb); //passing que_numb value to queCounter
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        startTimer(TIME_VALUE); //calling startTimer function
        startTimerLine(widthValue); //calling startTimerLine function
        timeText.textContent = "還剩"; //change the timeText to Time Left
        next_btn.classList.remove("show"); //hide the next button
    } else {
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        showResult(); //calling showResult function
    }
}

function changeVariable(inputString, varArr) {
    var newString;
    newString = inputString.replace("{a}", varArr[0]);
    newString = newString.replace("{b}", varArr[1]);
    newString = newString.replace("{c}", varArr[2]);
    newString = newString.replace("{a+b}", String(varArr[0] + varArr[1]));
    newString = newString.replace("{a-b}", String(varArr[0] - varArr[1]));
    newString = newString.replace("{b-a}", String(varArr[1] - varArr[0]));
    newString = newString.replace("{a+b-10}", String(varArr[0] + varArr[1] - 10));
    newString = newString.replace("{a-b+10}", String(varArr[0] - varArr[1] + 10));
    newString = newString.replace("{a-b-10}", String(varArr[0] - varArr[1] - 10));
    newString = newString.replace("{a+b+10}", String(varArr[0] + varArr[1] + 10));
    newString = newString.replace("{a*10}", String(varArr[0] * 10));
    newString = newString.replace("{a*10+b}", String(varArr[0] * 10) + varArr[1]);
    newString = newString.replace("{a*100+b*10+c}", String(varArr[0] * 100 + varArr[1] * 10 + varArr[2]));
    // alert(inputString + "\n" + newString)
    return newString;
}

function getQuestions() {
    //ben_test
    var selCategory = document.getElementById("category").value;
    var selLevel = document.getElementById("level").value;
    var selFile = "./data/" + selCategory + "_" + selLevel + ".csv";


    var read = new XMLHttpRequest();
    read.open('GET', selFile, false);
    read.setRequestHeader('Cache-Control', 'no-cache');
    read.send();
    var displayName = read.responseText;
    var quesArr = displayName.replace(/\r\n/g, '\n').split('\n');
    var quesList = [];
    let quesCnt = quesArr.length;
    let ansList = [];
    let tmpCnt = 0;
    let varArr = [];

    //1.get random list from file
    while (quesList.length < quesCnt) {
        var r = Math.floor(Math.random() * quesCnt);
        if (quesList.indexOf(r) === -1) quesList.push(r);
    }

    class Question {
        numb;
        question;
        answer;
        option1;
        option2;
        option3;
        option4;
    }
    //2.generate questions
    questions = [];
    var i;
    var j;
    var newValue;
    for (i = 0; i < quesCnt; i++) {
        varArr = [];
        var singQuesArr = quesArr[quesList[i]].split(',');
        for (j = 0; j < 3; j++) {
            if (j > 0) {
                if (varArr[j] === varArr[j - 1]) {
                    j--;
                    continue;
                }
            }
            newValue = Math.floor(Math.random() * 99) + 1;
            // alert(newValue);
            varArr.push(newValue);
        }
        let question = new Question();
        question.numb = i + 1;
        question.question = changeVariable(singQuesArr[0], varArr);
        ansList = [];
        question.answer = changeVariable(singQuesArr[1], varArr);

        while (ansList.length < 4) {
            var r = Math.floor(Math.random() * 4) + 1;
            if (ansList.indexOf(r) === -1) ansList.push(r);
        }
        question.option1 = changeVariable(singQuesArr[ansList[0]], varArr);
        question.option2 = changeVariable(singQuesArr[ansList[1]], varArr);
        question.option3 = changeVariable(singQuesArr[ansList[2]], varArr);
        question.option4 = changeVariable(singQuesArr[ansList[3]], varArr);
        questions[i] = question;
    }
}

// getting questions and options from array
function showQuetions(index) {
    const que_text = document.querySelector(".que_text");
    //creating a new span and div tag for question and option and passing the value using array index
    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let option_tag = '<div class="option"><span>' + questions[index].option1 + '</span></div>'
        + '<div class="option"><span>' + questions[index].option2 + '</span></div>'
        + '<div class="option"><span>' + questions[index].option3 + '</span></div>'
        + '<div class="option"><span>' + questions[index].option4 + '</span></div>';
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag

    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for (i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(answer) {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    let userAns = answer.textContent; //getting user selected option
    let correcAns = questions[que_count].answer; //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items

    if (userAns == correcAns) { //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1
        answer.classList.add("correct"); //adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    } else {
        answer.classList.add("incorrect"); //adding red color to correct selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
        console.log("Wrong Answer");

        for (i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) { //if there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                console.log("Auto selected correct answer.");
            }
        }
    }
    for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    next_btn.classList.add("show"); //show the next button if user selected any option
}

function showResult() {
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
    const resultICON = result_box.querySelector(".icon");
    let final_score = Math.floor(userScore * 100 / questions.length);

    var myNewScore = final_score;
    var selCategory = document.getElementById("category").value;
    var selLevel = document.getElementById("level").value;
    var myStorageScore = localStorage.getItem(selCategory + "_" + selLevel);
    if (myStorageScore === null) myStorageScore = 0;

    if (myNewScore > myStorageScore) localStorage.setItem(selCategory + "_" + selLevel, myNewScore);

    if (final_score === 100) { // if user scored more than 3
        resultICON.innerHTML = '<i class="fas fa-crown"></i>';
        //creating a new span tag and passing the user score number and total question number
        let scoreTag = '<span>恭喜! 🎉, 你得到 <p>' + final_score + '</p> 分 </span>';
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if (final_score >= 80) { // if user scored more than 1
        resultICON.innerHTML = '<i class="fas fa-grin-beam-sweat"></i>';
        let scoreTag = '<span>不錯 😎, 你得到 <p>' + final_score + '</p> 分 </span>';
        scoreText.innerHTML = scoreTag;
    }
    else { // if user scored less than 1
        resultICON.innerHTML = '<i class="fas fa-tired"></i>';
        let scoreTag = '<span>很可惜 😐, 你只得到 <p>' + final_score + '</p> 分 </span>';
        scoreText.innerHTML = scoreTag;
    }
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if (time < 9) { //if timer is less than 9
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if (time < 0) { //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "時間到"; //change the time text to time off
            const allOptions = option_list.children.length; //getting all option items
            let correcAns = questions[que_count].answer; //getting correct answer from array
            for (i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) { //if there is an option which is matched to an array answer
                    option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for (i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
            next_btn.classList.add("show"); //show the next button if user selected any option
        }
    }
}

function startTimerLine(time) {
    // counterLine = setInterval(timer, 29);
    counterLine = setInterval(timer, 116);

    function timer() {
        time += 1; //upgrading time value with 1
        time_line.style.width = time + "px"; //increasing width of time_line with px by time value
        if (time > 549) { //if time value is greater than 549
            clearInterval(counterLine); //clear counterLine
        }
    }
}

function queCounter(index) {
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span> 問題 (	&nbsp; <p>' + index + '</p> / <p>' + questions.length + ' )</p></span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}
