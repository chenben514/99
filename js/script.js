//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const correct_list = document.querySelector(".correct_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// if startQuiz button clicked
start_btn.onclick = () => {
  quiz_box.classList.add("activeQuiz"); //show quiz box
  getQuestions();
  showQuetions(0); //calling showQestions function
  queCounter(1); //passing 1 parameter to queCounter
  startTimer(15); //calling startTimer function
  startTimerLine(0); //calling startTimerLine function
};

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = () => {
  quiz_box.classList.add("activeQuiz"); //show quiz box
  result_box.classList.remove("activeResult"); //hide result box
  timeValue = 15;
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
};

// if quitQuiz button clicked
quit_quiz.onclick = () => {
  window.location.reload(); //reload the current window
};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
  if (que_count < questions.length - 1) {
    //if question count is less than total question length
    que_count++; //increment the que_count value
    que_numb++; //increment the que_numb value
    showQuetions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(timeValue); //calling startTimer function
    startTimerLine(widthValue); //calling startTimerLine function
    timeText.textContent = "還剩"; //change the timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    showResult(); //calling showResult function
  }
};

function getQuestions() {
  //ben_test
  var selCategory = document.getElementById("category").value;
  var selLevel = document.getElementById("level").value;
  var selFile = "./data/" + selCategory + "_" + selLevel + ".csv";

  var read = new XMLHttpRequest();
  read.open("GET", selFile, false);
  read.setRequestHeader("Cache-Control", "no-cache");
  read.send();
  var displayName = read.responseText;
  var quesArr = displayName.replace(/\r\n/g, "\n").split("\n");
  var quesList = [];
  let quesCnt = quesArr.length;
  let ansList = [];
  let tmpCnt = 0;

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
  for (i = 0; i < quesCnt; i++) {
    var singQuesArr = quesArr[quesList[i]].split(",");
    let question = new Question();
    question.numb = i + 1;
    question.question = singQuesArr[0];
    question.answer = singQuesArr[1];
    ansList = [];
    while (ansList.length < 4) {
      var r = Math.floor(Math.random() * 4) + 1;
      if (ansList.indexOf(r) === -1) ansList.push(r);
    }
    question.option1 = singQuesArr[ansList[0]];
    question.option2 = singQuesArr[ansList[1]];
    question.option3 = singQuesArr[ansList[2]];
    question.option4 = singQuesArr[ansList[3]];
    questions[i] = question;
  }
}

// getting questions and options from array
function showQuetions(index) {
  const que_text = document.querySelector(".que_text");

  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag =
    "<span>" +
    questions[index].numb +
    ". " +
    questions[index].question +
    "</span>";

  let answer_target =
    '<div><input type="text" class="direct_input" name="direct_input" value="" placeholder="輸入答案" style="width:150px;height:40px;font-size:20px;padding:10px;">';
  answer_target +=
    "<span> <button onclick='confirmClick()' style='width:70px;height:40px;' >確認</button></span> </div>";
  curQuesType = "direct_input";

  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = answer_target; //adding new div tag inside option_tag
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

  if (userAns == correcAns) {
    //if user selected option is equal to array's correct answer
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
      if (option_list.children[i].textContent == correcAns) {
        //if there is an option which is matched to an array answer
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
  let final_score = Math.floor((userScore * 100) / questions.length);

  var myNewScore = final_score;
  var selCategory = document.getElementById("category").value;
  var selLevel = document.getElementById("level").value;
  var myStorageScore = localStorage.getItem(selCategory + "_" + selLevel);
  if (myStorageScore === null) myStorageScore = 0;

  if (myNewScore > myStorageScore)
    localStorage.setItem(selCategory + "_" + selLevel, myNewScore);

  if (final_score === 100) {
    // if user scored more than 3
    resultICON.innerHTML = '<i class="fas fa-crown"></i>';
    //creating a new span tag and passing the user score number and total question number
    let scoreTag =
      "<span>恭喜! 🎉, 你得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
  } else if (final_score >= 80) {
    // if user scored more than 1
    resultICON.innerHTML = '<i class="fas fa-grin-beam-sweat"></i>';
    let scoreTag =
      "<span>不錯 😎, 你得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  } else {
    // if user scored less than 1
    resultICON.innerHTML = '<i class="fas fa-tired"></i>';
    let scoreTag =
      "<span>很可惜 😐, 你只得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  }
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "時間到"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns = questions[que_count].answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          //if there is an option which is matched to an array answer
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
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1; //upgrading time value with 1
    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    if (time > 549) {
      //if time value is greater than 549
      clearInterval(counterLine); //clear counterLine
    }
  }
}

function queCounter(index) {
  //creating a new span tag and passing the question number and total question
  let totalQueCounTag =
    "<span> 問題 (	&nbsp; <p>" +
    index +
    "</p> / <p>" +
    questions.length +
    " )</p></span>";
  bottom_ques_counter.innerHTML = totalQueCounTag; //adding new span tag inside bottom_ques_counter
}

function confirmClick() {
  let inputAnswer = document.querySelector(".direct_input").value;
  let correctAnswer = questions[que_count].answer;
  if (inputAnswer === correctAnswer) directSelected("correct");
  else directSelected("incorrect");
}

function directSelected(userAns) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  let correcAns = questions[que_count].answer; //getting correct answer from array

  if (userAns === "correct") {
    userScore += 1; //upgrading score value with 1
    if (curQuesType === "direct_input") {
      document.querySelector(".direct_input").style.backgroundColor = "green";
    }
  } else {
    console.log("Wrong Answer");
    if (curQuesType !== "direct_input") {
      document.querySelector(".option").classList.add("incorrect");
    } //adding red color to correct selected option
    else {
      document.querySelector(".direct_input").style.backgroundColor = "red";
    }
    document.querySelector(".correct_list").inner_html =
      questions[que_count].answer;
    correct_list.innerHTML = questions[que_count].answer;

    if (curQuesType === "direct_input") {
      correct_list.innerHTML = questions[que_count].answer;
    }
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
}
