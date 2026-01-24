import React, { useState, useEffect, useRef } from 'react';
import { Music, ArrowUp, ArrowDown, Heart, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const MIN_FREQ = 130.81;   // C3
const MAX_FREQ = 1046.50;  // C6

// Difficulty model (logarithmic)
const DELTA_SEMITONES_START = 4;
const DELTA_SEMITONES_MIN = 0.1;
const K_FACTOR = 0.2;

export default function Game({ onExit }) {
    const [gameState, setGameState] = useState('playing');
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [firstFreq, setFirstFreq] = useState(0);
    const [secondFreq, setSecondFreq] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [lastGuess, setLastGuess] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [canInput, setCanInput] = useState(false);

    const audioContext = useRef(null);

    const initAudio = () => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const playPitch = (freq, duration = 0.8) =>
        new Promise(resolve => {
            const osc = audioContext.current.createOscillator();
            const gain = audioContext.current.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);

            gain.gain.setValueAtTime(0, audioContext.current.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, audioContext.current.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioContext.current.destination);

            osc.start();
            osc.stop(audioContext.current.currentTime + duration);

            setTimeout(resolve, duration * 1000);
        });

    const generateNextLevel = (targetLevel, currentFirst = null) => {
        const safeMin = MIN_FREQ * 1.1;
        const safeMax = MAX_FREQ / 1.1;

        const f1 = currentFirst ?? (Math.random() * (safeMax - safeMin) + safeMin);

        const deltaSemitones =
            DELTA_SEMITONES_START * Math.exp(-K_FACTOR * targetLevel) +
            DELTA_SEMITONES_MIN;

        const ratio = Math.pow(2, deltaSemitones / 12);

        let direction;
        if (f1 * ratio > MAX_FREQ) direction = 'd';
        else if (f1 / ratio < MIN_FREQ) direction = 'u';
        else direction = Math.random() > 0.5 ? 'u' : 'd';

        const f2 = direction === 'u' ? f1 * ratio : f1 / ratio;

        setFirstFreq(f1);
        setSecondFreq(f2);
        setIsCorrect(null);
        setLastGuess(null);
        setCanInput(false);
    };

    const startGame = () => {
        initAudio();
        setGameState('playing');
        setLevel(1);
        setLives(3);
        generateNextLevel(1);
    };

    const playSequence = async () => {
        if (isPlaying) return;

        setIsPlaying(true);
        setCanInput(false);

        if (level === 1) {
            await playPitch(firstFreq);
            await new Promise(r => setTimeout(r, 400));
        }

        await playPitch(secondFreq);

        setIsPlaying(false);
        setCanInput(true);
    };

    const handleGuess = guess => {
        if (!canInput) return;

        const actual = secondFreq > firstFreq ? 'u' : 'd';
        const won = guess === actual;

        setIsCorrect(won);
        setLastGuess(guess);
        setCanInput(false);

        setTimeout(() => {
            if (won) {
                const next = level + 1;
                setLevel(next);
                generateNextLevel(next, secondFreq);
            } else {
                const remaining = lives - 1;
                setLives(remaining);
                if (remaining <= 0) {
                    setGameState('gameover');
                } else {
                    const next = level + 1;
                    setLevel(next);
                    generateNextLevel(next, secondFreq);
                }
            }
        }, 800);
    };

    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {
        if (gameState === 'playing' && firstFreq) {
            playSequence();
        }
    }, [firstFreq, gameState]);

    return (
        <>
            {gameState === 'playing' && (
                <motion.div
                    className="screen-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="playing"
                >
                    <div className="stats">
                        <span><Trophy size={18} /> Lvl {level}</span>
                        <span>
                            <Heart size={18} fill={lives > 0 ? "#ef4444" : "transparent"} color="#ef4444" />
                            {lives}
                        </span>
                    </div>

                    <div>
                        <div className={`pitch-indicator ${isPlaying ? 'playing' : ''}`}>
                            <Music size={32} color={isPlaying ? "#fff" : "rgba(255,255,255,0.3)"} />
                        </div>
                        <div className="feedback">
                            {isCorrect === true && <span className="correct">Correct!</span>}
                            {isCorrect === false && <span className="wrong">Wrong!</span>}
                        </div>
                    </div>

                    <div className="controls">
                        <button
                            className={`secondary ${lastGuess === 'u' ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                            onClick={() => handleGuess('u')}
                            disabled={!canInput}
                        >
                            <ArrowUp size={32} />
                            Higher
                        </button>
                        <button
                            className={`secondary ${lastGuess === 'd' ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                            onClick={() => handleGuess('d')}
                            disabled={!canInput}
                        >
                            <ArrowDown size={32} />
                            Lower
                        </button>
                    </div>
                </motion.div>
            )}

            {gameState === 'gameover' && (
                <motion.div
                    className="game-over-screen"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key="gameover"
                >
                    <div>
                        <h1 style={{ color: '#ef4444', background: 'none', WebkitTextFillColor: '#ef4444' }}>
                            Game Over
                        </h1>
                        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                            Score: Level {level}
                        </p>
                    </div>
                    <button className="primary" onClick={startGame}>
                        Try Again
                    </button>
                    {onExit && (
                        <button className="secondary" onClick={onExit} style={{ marginTop: '1rem' }}>
                            Back to Home
                        </button>
                    )}
                </motion.div>
            )}
        </>
    );
}
