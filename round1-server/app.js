const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
app.use(cors({
    origin: "*"
}));
app.use(express.json());

let startTime = Date.now() + 10000; // initial input through admin
const duration = 5000; // 60000 = 1 min per Q
let currentQ = 0;
let isQuestionActive = false;

const dummyData = [
    {
        id: 1,
        Q: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        ans: "Paris"
    },
    {
        id: 2,
        Q: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        ans: "Mars"
    },
    {
        id: 3,
        Q: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "J.K. Rowling", "George Orwell", "Ernest Hemingway"],
        ans: "Harper Lee"
    },
    {
        id: 4,
        Q: "What is the largest mammal on Earth?",
        options: ["Blue Whale", "Elephant", "Giraffe", "Shark"],
        ans: "Blue Whale"
    },
    {
        id: 5,
        Q: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        ans: "H2O"
    }
];

(function initQuiz() {
    const timeCheckInterval = setInterval(() => {
        if (Date.now() >= startTime && currentQ < dummyData.length && !isQuestionActive) {
            isQuestionActive = true;

            console.log('Q sent, TIME: ', Date());
            io.emit('questionStart', {
                data: {
                    id: dummyData[currentQ].id,
                    Q: dummyData[currentQ].Q,
                    options: dummyData[currentQ].options
                },
                timestamp: Date.now(),
                remainingTime: duration
            });

            const countdownInterval = setInterval(() => {
                let remainingTime = startTime + duration - Date.now();
                if (remainingTime <= 0) {
                    clearInterval(countdownInterval);
                    io.emit('questionEnd', { ans: dummyData[currentQ].ans });
                    console.log('questionEnd, TIME: ', Date());
                    setTimeout(() => {
                        currentQ++;
                        startTime = Date.now();
                        isQuestionActive = false;
                    }, 15000); // 5 (solution display) + 10 (leaderboard) sec break
                } else {
                    io.emit('timerUpdate', { remainingTime });
                    console.log('timerUpdate', remainingTime);
                }
            }, 1000); // update countdown every sec
        } else if (currentQ >= dummyData.length) {
            io.emit('quizEnd');
            console.log('end...');
            clearInterval(timeCheckInterval);
        }
    }, 100);
})();

io.on('connection', (socket) => {
    console.log('User connected');

    // for user joining in between a question
    const newConInterval = setInterval(function () {
        if (Date.now() >= startTime && currentQ < dummyData.length && isQuestionActive) {
            socket.emit('questionStart', {
                data: {
                    id: dummyData[currentQ].id,
                    Q: dummyData[currentQ].Q,
                    options: dummyData[currentQ].options
                },
                timestamp: Date.now(),
                remainingTime: startTime + duration - Date.now()
            });
            clearInterval(newConInterval);
        } else if (currentQ >= dummyData.length) clearInterval(newConInterval)
    }, 100)

    socket.on('disconnect', () => {
        console.log('User disconnected');
        clearInterval(newConInterval);
    });
});

app.post('/api/:id', function (req, res) {
    // auth check to get team id
    const option = req.body.option;
    const id = req.params.id;
    if (option === dummyData[id - 1].ans)
        res.json({ "correct": true }); // add points here
    else
        res.json({ "correct": false });
})
app.post('/api/admin/question', function (req, res) {
    // auth check for admin 
    // console.log(req.body)
    const { question, options, ans } = req.body;
    if (!question || !options || !ans)
        res.json({ "ok": false, "message": "Incomplete Data, some fields may be missing: (question, options, ans)" });
    else // save in DB
        res.json({ "ok": true, "data": "{question object}" });
})

app.post('/api/admin/quiz', function (req, res) {
    // for configuring start time, batch number, currentQ, etc.
    // 1. clear all timers, start new timers
    initQuiz();
})

server.listen(5000, () => {
    console.log('Server has started on port 5000');
});
