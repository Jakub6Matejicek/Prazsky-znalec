import { useState, useEffect } from 'react'
import PanoMap from "../components/PanoMap"
import Map from '../components/Map'
import Countdown from '../components/Countdown';
import CountdownDisplay from '../components/CountdownDisplay';
import AnswereWindow from '../components/AnswereWindow'
import cities from '../data/cities.json'


function SinglePlayerRound() {
  const [count, setCount] = useState(5)
  const [startLat, setStartLat] = useState<number>(50.002920)
  const [startLng, setStartLng] = useState<number>(14.235599)
  const [endLat, setEndLat] = useState<number>(50.144702)
  const [endLng, setEndLng] =useState<number>(14.611197)
  const [gameFinished, setGameFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0); // Stav pro zobrazení
  const countdown = new Countdown(count);
  const city = "Prague";


  const defaultLat = (Math.random() * (endLat - startLat) + startLat)
  const defaultLng = (Math.random() * (endLng - startLng) + startLng)


  useEffect(() => {
    console.log(`Vygenerovana pozice
        lat: ${defaultLat},
        lng: ${defaultLng}
        `);

    countdown.start(
      (time) => setTimeLeft(time), // Aktualizuje stav
      () => setGameFinished(true) // Volitelný callback po dokončení
    );

    return () => countdown.stop(); // Zastavení odpočítávání při unmountování komponenty
  }, []);




  return (
    <>
    <div className='max-w-screen max-h-screen w-screen h-screen'>
      <PanoMap defaultLat={defaultLat} defaultLon={defaultLng}/>
      <CountdownDisplay timeLeft={timeLeft} startTime={count}/>
    </div>
    <div className='z-10 absolute max-w-20 max-h-16 w-20 h-16 right-5 bottom-5 bg-black'
    style={{width: '400px', height: '300px', position: 'absolute', right: '25px', bottom: '25px'}}>
      <Map />
    </div>
    {gameFinished && <AnswereWindow guessingLat={defaultLat} guessingLng={defaultLng} guessedLat={50.10682238300945} guessedLng={14.608134692510466}/>}
    </>
  )
}

export default SinglePlayerRound
