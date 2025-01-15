import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SparkleBackground from "../components/SparkleBackground";
import { useFirebase } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const LoginPage = () => {
  const [teamName, setTeamName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const firebase=useFirebase()

  
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
        await firebase.signInUser(leaderEmail, teamName);
        navigate('/');
    } catch (error) {
        console.error("Error during login:", error);
        alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
      <SparkleBackground />
      <div className="relative z-10 flex flex-col items-center">
        <form
          className="p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-yellow-400"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "2px solid rgba(255, 215, 0, 0.8)",
          }}
          onSubmit={handleLogin}
        >
          <h2 className="text-yellow-400 text-3xl mb-8 font-bold glow-text">
            Welcome, Contestant!
          </h2>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-80 p-4 mb-5 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner"
            required
          />
          <input
            type="email"
            placeholder="Leader's Email"
            value={leaderEmail}
            onChange={(e) => setLeaderEmail(e.target.value)}
            className="w-80 p-4 mb-8 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner"
            required
          />
          <button
            type="submit"
            className={`bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-black font-bold px-8 py-3 rounded-full shadow-lg w-72 transition-transform transform hover:scale-105 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
