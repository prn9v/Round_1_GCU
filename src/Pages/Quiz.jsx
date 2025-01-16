import React, { useState, useEffect, useRef } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { useFirebase } from "../firebase";
import Timer from "../components/Timer";
import Leaderboard from "../components/LeaderBoard";
import SparkleBackground from "../components/SparkleBackground";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQues, setCurrentQues] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitted, setQuizCompleted] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const [seconds, setSeconds] = useState(30);
  const [userId, setUserId] = useState(null);
  const timerRef = useRef(null);
  const [phase, setPhase] = useState("question");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const firebase = useFirebase();

  useEffect(() => {
    if (firebase?.user) {
      setUserId(firebase.user.uid);
    }
  }, [firebase?.user]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const db = getDatabase();
      const dbRef = ref(db, "Question1");

      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const current = data.filter(batch => batch.isActive)[0];
          const formattedQuestions = Object.values(current).map((q) => ({
            num: q.QuestionNo,
            ques: q.QuestionName,
            options: q.options,
            correctAnswer: q.CorrectAns,
          }))
          //   .sort((a, b) => a - b);
          // console.log(formattedQuestions)
          setQuestions(formattedQuestions);
        } else {
          console.log("No questions available");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      handleTimeUp();
    }

    return () => clearInterval(timerRef.current);
  }, [seconds, phase]);

  const handleTimeUp = () => {
    if (phase === "question") {
      if (!answerSubmitted) {
        handleSubmit();
      }
      setPhase("answer");
      setSeconds(5);
    } else if (phase === "answer") {
      setPhase("leaderboard");
      setSeconds(5);
    } else if (phase === "leaderboard") {
      if (currentQues + 1 >= questions.length) {
        setQuizCompleted(true);
      } else {
        goToNextQuestion();
      }
    }
  };

  const goToNextQuestion = () => {
    setHighlight(null);
    setSelectedOption("");
    setCurrentQues((prev) => prev + 1);
    setSeconds(() => currentQues > 29 ? 180 : 30);
    setPhase("question");
    setAnswerSubmitted(false);
  };

  const handleOptionSelect = (option) => {
    if (phase === "question" && !answerSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    setAnswerSubmitted(true);
    if (selectedOption === questions[currentQues]?.correctAnswer) {
      setHighlight("green");
      updateScore();
    } else {
      setHighlight("red");
    }
  };

  const updateScore = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const db = getDatabase();
    const teamRef = ref(db, `teams/${userId}`);

    try {
      const snapshot = await get(teamRef);
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        const updatedData = {
          round1: (currentData.round1 || 0) + 10,
          overall: (currentData.overall || 0) + 10,
        };
        await update(teamRef, updatedData);
      } else {
        await update(teamRef, {
          round1: 10,
          overall: 10,
        });
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const renderQuestion = () => (
    <>
      <div className="question-container bg-blue-900 items-center mb-5 justify-center border-2 border-yellow-400 rounded-lg">
        <h1 className="mt-6 text-3xl text-yellow-400">
          Question {questions[currentQues]?.num}
        </h1>
        <p className="mb-6 text-2xl text-white">
          {questions[currentQues]?.ques}
        </p>
      </div>
      <ul className="list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
        {questions[currentQues]?.options.map((option) => (
          <li
            key={option}
            className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-transform duration-200 transform hover:scale-105 shadow-md w-full sm:w-56 mx-auto ${selectedOption === option
              ? "bg-blue-700 border-yellow-400"
              : "bg-blue-900 border-yellow-400"
              }`}
          >
            <button
              type="button"
              className="w-full transform p-2 text-center rounded-lg transition duration-300 focus:outline-none active:bg-blue-700 hover:bg-blue-800"
              onClick={() => handleOptionSelect(option)}
              disabled={answerSubmitted}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {!answerSubmitted && (
        <button
          className="bg-yellow-400 text-black text-lg px-5 py-2.5 rounded mt-5 transition duration-300 hover:enabled:bg-yellow-500 hover:enabled:shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={!selectedOption}
        >
          Submit
        </button>
      )}
    </>
  );

  const renderAnswer = () => (
    <>
      <div className="question-container bg-blue-900 items-center mb-5 justify-center border-2 border-yellow-400 rounded-lg">
        <h1 className="mt-6 text-3xl text-yellow-400">
          Question {currentQues + 1}
        </h1>
        <p className="mb-6 text-2xl text-white">
          {questions[currentQues]?.ques}
        </p>
      </div>
      <ul className="list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
        {questions[currentQues]?.options.map((option) => (
          <li
            key={option}
            className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-transform duration-200 transform hover:scale-105 shadow-md w-full sm:w-56 mx-auto ${option === questions[currentQues]?.correctAnswer
              ? "bg-green-500 border-green-700"
              : option === selectedOption
                ? "bg-red-500 border-red-700"
                : "bg-blue-900 border-yellow-400"
              }`}
          >
            <button
              type="button"
              className="w-full transform p-2 text-center rounded-lg transition duration-300 focus:outline-none active:bg-blue-700 hover:bg-blue-800"
              disabled
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
      <SparkleBackground />
      <div className="quiz-container">
        <div className="quiz-content relative text-center p-5 max-w-lg mx-auto">
          {!isSubmitted ? (
            questions.length > 0 ? (
              <>
                <Timer seconds={seconds} />
                {phase === "question" && renderQuestion()}
                {phase === "answer" && renderAnswer()}
                {phase === "leaderboard" && (
                  <div className="leaderboard-container bg-blue-900 items-center mb-5 justify-center border-2 border-yellow-400 rounded-lg p-4">
                    <h2 className="text-2xl text-yellow-400 mb-4">Leaderboard</h2>
                    <Leaderboard />
                  </div>
                )}
              </>
            ) : (
              <h1 className="text-2xl text-white">Loading questions...</h1>
            )
          ) : (
            <div>
              <h1 className="mt-5 text-3xl text-yellow-400">Quiz Completed!</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;




