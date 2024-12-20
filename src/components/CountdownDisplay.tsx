import React, { useEffect, useState } from 'react';

interface CountdownProps {
    startTime: number;
    timeLeft: number;
  }

const CountdownDisplay: React.FC<CountdownProps> = ({ timeLeft, startTime }) =>  {

    const secondsLeft = Math.floor(timeLeft / 100);
    const centisecondsLeft = timeLeft % 100;

    return (
        <div style={{position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', top: '50px'}}>
            <input type="range" min="0" max={startTime*100} value={timeLeft} className="slider" />
            <h1>
                {secondsLeft}.{centisecondsLeft.toString().padStart(2, '0')}
            </h1>
        </div>
    );
}

export default CountdownDisplay;
