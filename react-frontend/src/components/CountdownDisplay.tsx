// src/components/CountdownDisplay.tsx

import React from 'react';

interface CountdownProps {
  timeLeft: number; // setiny sekundy
  startTime: number; // v sekundách
}

const CountdownDisplay: React.FC<CountdownProps> = ({ timeLeft, startTime }) => {
  const secondsLeft = Math.floor(timeLeft / 100);
  const centisecondsLeft = timeLeft % 100;

  return (
    <div className="absolute top-10 w-full flex justify-center items-center flex-col ">
      <input
        id="timer"
        type="range"
        min="0"
        max={startTime * 100}
        value={timeLeft}
        className="slider w-4/6 md:w-1/3"
        readOnly
      />
      <h1 className="text-xl text-white px-3 py-1 rounded absolute">
        {secondsLeft}.{centisecondsLeft.toString().padStart(2, '0')} s
      </h1>
    </div>
  );
};

export default CountdownDisplay;
