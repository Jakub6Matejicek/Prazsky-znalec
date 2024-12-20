import { useState, useEffect } from 'react'
import './index.css';
import PanoMap from "./components/PanoMap"
import Map from './components/Map'
import Countdown from './components/Countdown';
import CountdownDisplay from './components/CountdownDisplay';
import SinglePlayerRound from './components/SinglePlayerRound';

function App() {
  return (
    <>
    <SinglePlayerRound />
    </>
  )
}

export default App
