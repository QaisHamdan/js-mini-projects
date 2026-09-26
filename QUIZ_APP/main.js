// Select DOM Elements
const countSpan = document.querySelector(".count span");
const bulletsSpanContainer = document.querySelector(".bullets .spans");
const quizArea = document.querySelector(".quiz-area");
const answersArea = document.querySelector(".answers-area");
const submitButton = document.querySelector(".submit-button");
const bulletsContainer = document.querySelector(".bullets");
const resultsArea = document.querySelector(".results");
const countdownElement = document.querySelector(".countdown");

// Quiz State
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval = null;
let questions = [];

// 1. Modern Data Fetching with Async/Await & Fetch API
async function getQuestions() {
  try {
    const response = await fetch("html_questions.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    questions = await response.json();
    const qCount = questions.length;

    if (qCount === 0) return;

    createBullets(qCount);
    addQuestionData(questions[currentIndex], qCount);
    startCountdown(90, qCount);

    // Handle Submit Click
    submitButton.onclick = () => handleSubmit(qCount);
  } catch (error) {
    console.error("Failed to load questions:", error);
    quizArea.innerHTML = "<p>Error loading questions. Please try again later.</p>";
  }
}

// 2. Event Handler for Submitting Answers
function handleSubmit(qCount) {
  const rightAnswer = questions[currentIndex].right_answer;
  
  checkAnswer(rightAnswer);
  currentIndex++;

  // Always clear previous timer before moving to next step
  clearInterval(countdownInterval);

  if (currentIndex < qCount) {
    // Reset Question UI
    quizArea.innerHTML = "";
    answersArea.innerHTML = "";

    addQuestionData(questions[currentIndex], qCount);
    handleBullets();
    startCountdown(90, qCount);
  } else {
    showResults(qCount);
  }
}

// 3. Create Pagination Bullets
function createBullets(num) {
  countSpan.textContent = num;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < num; i++) {
    const bullet = document.createElement("span");
    if (i === 0) bullet.classList.add("on");
    fragment.appendChild(bullet);
  }

  bulletsSpanContainer.appendChild(fragment);
}

// 4. Render Current Question & Answers
function addQuestionData(questionObj, count) {
  if (currentIndex >= count) return;

  // Title
  const questionTitle = document.createElement("h2");
  questionTitle.textContent = questionObj.title;
  quizArea.appendChild(questionTitle);

  // Options Fragment for faster DOM rendering
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= 4; i++) {
    const answerKey = `answer_${i}`;
    if (!questionObj[answerKey]) continue;

    const mainDiv = document.createElement("div");
    mainDiv.className = "answer";

    const radioInput = document.createElement("input");
    radioInput.name = "question";
    radioInput.type = "radio";
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = questionObj[answerKey];
    if (i === 1) radioInput.checked = true;

    const label = document.createElement("label");
    label.htmlFor = `answer_${i}`;
    label.textContent = questionObj[answerKey];

    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(label);
    fragment.appendChild(mainDiv);
  }

  answersArea.appendChild(fragment);
}

// 5. Evaluate Selected Answer
function checkAnswer(rightAnswer) {
  const selectedRadio = document.querySelector('input[name="question"]:checked');
  if (selectedRadio && selectedRadio.dataset.answer === rightAnswer) {
    rightAnswers++;
  }
}

// 6. Highlight Active Bullet Point
function handleBullets() {
  const bullets = bulletsSpanContainer.querySelectorAll("span");
  bullets.forEach((bullet, index) => {
    bullet.classList.toggle("on", index === currentIndex);
  });
}

// 7. Display Final Results
function showResults(count) {
  // Clear areas safely without removing nodes permanently
  quizArea.innerHTML = "";
  answersArea.innerHTML = "";
  submitButton.style.display = "none";
  bulletsContainer.style.display = "none";

  let resultMarkup = "";
  if (rightAnswers > count / 2 && rightAnswers < count) {
    resultMarkup = `<span class="good">Good</span>, ${rightAnswers} out of ${count}`;
  } else if (rightAnswers === count) {
    resultMarkup = `<span class="perfect">Perfect</span>, All answers are correct!`;
  } else {
    resultMarkup = `<span class="bad">Bad</span>, ${rightAnswers} out of ${count}`;
  }

  resultsArea.innerHTML = resultMarkup;
  resultsArea.style.padding = "10px";
  resultsArea.style.backgroundColor = "white";
  resultsArea.style.marginTop = "10px";
}

// 8. Countdown Timer Logic
function startCountdown(duration, count) {
  if (currentIndex >= count) return;

  let timer = duration;

  countdownInterval = setInterval(() => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");

    countdownElement.textContent = `${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(countdownInterval);
      submitButton.click();
    }
  }, 1000);
}

// Initialize Application
getQuestions();