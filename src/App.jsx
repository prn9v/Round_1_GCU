import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./Pages/HomeScreen";
import Quiz from "./Pages/Quiz.jsx";
import { useFirebase } from "./firebase.jsx";
import { Navigate } from "react-router-dom";
import LoginPage from "./Pages/Login.jsx";
import Login from "./Pages/LoginPage.jsx";

const App = () => {
  const firebase=useFirebase();
  function ProtectedRoute({ children }) {
    if (!firebase.user) {
        return <Navigate to="/login" />;
    }
    return children;
}
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomeScreen/></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/quiz" element={<Quiz/>}/>
      </Routes>
    </Router>
  );
};

export default App;
