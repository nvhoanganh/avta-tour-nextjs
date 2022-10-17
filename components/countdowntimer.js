import React from 'react';

const CountDownTimer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return null;
  } else {
    // Render a countdown
    return <span>{days} days, {hours} hours, {minutes} minutes and {seconds} seconds</span>;
  }
};

export default CountDownTimer;