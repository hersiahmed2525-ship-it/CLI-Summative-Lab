const readline = require('readline');

// trivia questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["A) London", "B) Paris", "C) Berlin", "D) Madrid"],
        answer: "B"
    },
    {
        question: "Which language runs in a web browser?",
        options: ["A) Python", "B) C#", "C) JavaScript", "D) Java"],
        answer: "C"
    },
    {
        question: "What does HTML stand for?",
        options: [
            "A) Hyper Trainer Markup Language",
            "B) HyperText Markup Language",
            "C) HyperText Marketing Language",
            "D) Home Tool Markup Language"
        ],
        answer: "B"
    },
    {
        question: "Which company developed the React library?",
        options: ["A) Google", "B) Microsoft", "C) Facebook", "D) Apple"],
        answer: "C"
    },
    {
        question: "What year was JavaScript created?",
        options: ["A) 1993", "B) 1995", "C) 1998", "D) 2000"],
        answer: "B"
    }
];

const TIME_LIMIT_SECONDS = 15;

// set up readline for terminal input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// wrapper so we can await user input
function askQuestion(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => resolve(answer.trim()));
    });
}

// show a question and start a countdown timer
function presentQuestion(questionObj, index, total) {
    return new Promise((resolve) => {
        let timeLeft = TIME_LIMIT_SECONDS;
        let answered = false;

        console.log(`\n--- Question ${index + 1} of ${total} ---`);
        console.log(questionObj.question);
        questionObj.options.forEach((opt) => console.log(opt));

        const timer = setInterval(() => {
            timeLeft -= 1;
            process.stdout.write(`\rTime remaining: ${timeLeft}s   `);

            if (timeLeft <= 0 && !answered) {
                answered = true;
                clearInterval(timer);
                console.log("\n\nTime's up!");
                resolve(null);
            }
        }, 1000);

        rl.question("\nYour answer (A/B/C/D): ", (input) => {
            if (answered) return;
            answered = true;
            clearInterval(timer);
            process.stdout.write("\r                       \r");
            resolve(input.trim().toUpperCase());
        });
    });
}

// add up the correct answers
function calculateScore(results) {
    return results.reduce((total, r) => total + (r.correct ? 1 : 0), 0);
}

// build the end-of-game breakdown string
function buildSummary(results) {
    return results.map((r, i) => {
        const status = r.correct ? "Correct" : "Incorrect";
        return `  Q${i + 1}: ${status}  (Your answer: ${r.userAnswer || "none"})`;
    }).join("\n");
}

// main game loop
async function startQuiz() {
    console.log("==========================================");
    console.log("   WELCOME TO THE TRIVIA CHALLENGE");
    console.log("==========================================");
    console.log(`You have ${TIME_LIMIT_SECONDS} seconds per question.`);
    console.log("Type A, B, C, or D and press Enter.\n");

    const results = [];

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const userAnswer = await presentQuestion(q, i, questions.length);

        const correct = userAnswer === q.answer;
        results.push({ userAnswer, correct });

        if (userAnswer === null) {
            console.log(`The correct answer was: ${q.answer}`);
        } else if (correct) {
            console.log("Correct!");
        } else {
            console.log(`Incorrect. The correct answer was: ${q.answer}`);
        }
    }

    const score = calculateScore(results);
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    console.log("\n==========================================");
    console.log("              GAME OVER");
    console.log("==========================================");
    console.log(`Score: ${score} / ${total}  (${percentage}%)`);
    console.log("\nBreakdown:");
    console.log(buildSummary(results));

    let message = "";
    if (percentage === 100) message = "Perfect score!";
    else if (percentage >= 80) message = "Great job!";
    else if (percentage >= 60) message = "Not bad!";
    else if (percentage >= 40) message = "Keep practicing.";
    else message = "Try again, you'll get it!";

    console.log(`\n${message}\n`);

    rl.close();
}

startQuiz();