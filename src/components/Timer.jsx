import React, { useState } from "react";
import "./Timer.css"; // Import the CSS file for styles

const Timer = ({ seconds }) => {


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  return (
    <div className="cloader">
      <div className="clface">
        <div className="clsface">
          <div id="h2" className="hand"></div>
        </div>
        <div className="top"></div>
        <div className="bottom"></div>
        <div className="left"></div>
        <div className="right"></div>
        <div id="sub" className="pin"></div>
        <div id="h1" className="hand"></div>
        <div id="main" className="pin"></div>
      </div>

      {/* Display the formatted time */}
      <div className="timer-display text-white text-center">
        <p className="text-l">{formatTime(seconds)}</p>
      </div>
    </div>
  );
};

export default Timer;
