import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SparkleBackground from "../components/SparkleBackground";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setIsSubmitting(false);

      if (response.ok) {
        const data = await response.json();
        data.success
          ? navigate("/home")
          : alert("Invalid username or password.");
      } else {
        alert("Error logging in. Please try again later.");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error during login:", error);
      alert("An unexpected error occurred.");
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
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-80 p-4 mb-5 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
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
