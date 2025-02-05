import React, { useEffect, useState } from 'react'

const INITIAL_TIMER = 40;
const MAX_ROUNDS = 5;
const SCORE_INCREMENT = 1;


export default function Home() {
    const [timer, setTimer] = useState(INITIAL_TIMER);
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem("bestScore")) || 0);
    const [gameOver, setGameOver] = useState(false);

    const [feedBack, setFeedBack] = useState("");
    const [rgbColor, setRgbColor] = useState(generateRandomColor());
    const [options, setOptions] = useState(generateColorOptions(rgbColor));

    function generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }
    function generateColorOptions(correctColor) {
        const options = [correctColor];
        while (options.length < 6) {
            const randomColor = generateRandomColor();
            if (!options.includes(randomColor)) {
                options.push(randomColor);
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }

    useEffect(() => {
        if (gameOver) return;


        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                const newTimer = prevTimer - 0.1;
                return newTimer > 0 ? newTimer : 0;
            });
        }, 10);

        return () => clearInterval(interval);
    }, [timer, gameOver]);


    useEffect(() => {
        if (timer <= 0) {
            setFeedBack("🚫 Timeout");
            // resetRound
            resetRound();
        }
    }, [timer]);

    const resetRound = () => {
        if (round < MAX_ROUNDS) {
            const newColor = generateRandomColor();
            setRgbColor(newColor)
            setOptions(generateColorOptions(newColor))

            setTimeout(() => {
                setFeedBack("")
            }, 1000)

            setTimer(INITIAL_TIMER);
            setRound((prevRound) => prevRound + 1)
        } else {
            setGameOver(true)
        }
    };

    const handleGuess = (guess) => {
        if (guess === rgbColor) {
            setFeedBack("✓ Correct");
            const newScore = score + 1;
            setScore(newScore);

            if (newScore > bestScore) {
                setBestScore(newScore)
                localStorage.setItem("bestScore", newScore);
            }
        } else {
            setFeedBack("✗ Wrong")
        }

        setTimeout(resetRound, 1000);
    };

    const restartGame = () => {
        setTimer(INITIAL_TIMER);
        setRound(1);
        setScore(0);
        setGameOver(false);
        setFeedBack("");
        const newColor = generateRandomColor();
        setRgbColor(newColor);
        setOptions(generateColorOptions(newColor));
    };



    return (
        <div className=' overflow-hidden md:overflow-visible max-w-full '>
            <header className='max-w-full h-20 flex items-center gap-6 justify-between md:mx-20 mx-10'>
                <h1 className='md:text-3xl text-xl font-bold  font-sans text-sky-950'>COLOR GAME</h1>
                <div data-testid="gameStatus" className='md:text-2xl text-lg font-medium'>
                    {feedBack}
                </div>
            </header>
            <hr className='border-b-2 border-red-800 max-w-full' />
            <div className='flex justify-evenly gap-4 md:m-8 my-[4.5rem] max-w-full'>
                {/* STATS */}
                <div>
                    <p className=' md:text-2xl font-medium'>TIME</p>
                    <h2 className='font-medium md:text-xl'>{timer.toFixed(1)}</h2>
                </div>
                <div>
                    <p className='md:text-2xl font-medium'>ROUND</p>
                    <h2 className='font-medium md:text-xl'>{round}/5</h2>
                </div>
                <div>
                    <p className='md:text-2xl font-medium'>SCORE</p>
                    <h2 data-testid="score" className='font-medium md:text-xl'>{score}</h2>
                </div>
                <div>
                    <p className=' md:text-2xl font-medium'>BEST</p>
                    <h2 className='font-medium md:text-xl'>{bestScore}</h2>
                </div>
            </div>
            {!gameOver ?
                (<div className='max-w-full md:items-center grid justify-center place-self-center'>
                    <div data-testid="colorBox" className='md:mx-[10rem] mx-6 md:w-[30rem] w-[20rem] md:h-[10rem] h-[6rem] items-center flex justify-center place-self-center rounded-lg' style={{ backgroundColor: rgbColor }}>
                        <h2 dat-testid="gameInstruction" className='text-white md:text-2xl m-4 text-center  font-semibold'>WHAT COLOR IS THIS?</h2>
                    </div>

                    <div data-testid="colorOption" className='grid grid-cols-3 place-items-center place-self-center md:w-[40rem] w-[20rem] m-6 '>
                        {options.map((color) => {
                            return (
                                <button key={color}
                                    onClick={() => handleGuess(color)}
                                    className='m-2 p-4 rounded-[100%] border-0 cursor-pointer md:w-[80px] w-[50px] md:h-[80px] h-[50px]'
                                    style={{ backgroundColor: color }}
                                    aria-label={`Choose color ${color}`}
                                >
                                </button>
                            )
                        })}
                    </div>
                </div>
                ) : (
                    <div className=' max-w-full md:items-center grid justify-center place-self-center '>
                        <h2 className='flex md:justify-center md:text-3xl font-bold mx-5 mt-8 justify-center  '>Game Over! Thanks for playing. </h2>
                        <p className=' flex justify-center md:text-xl'>Your Total Score: <strong>{score}</strong> </p>
                        <button
                            onClick={restartGame}
                            data-testid="newGameButton"
                            className='m-6 px-6 py-3 bg-blue-600 text-white md:text-lg font-semibold rounded-lg hover:bg-blue-700  flex justify-center cursor-pointer'
                        >
                            Play Again
                        </button>
                    </div>
                )
            }
        </div>
    )
}
