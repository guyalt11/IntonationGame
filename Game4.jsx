import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GameHeader from './components/GameHeader';
import PitchIndicator from './components/PitchIndicator';
import AnswerButtons from './components/AnswerButtons';
import GameOver from './components/GameOver';
import { playPitch, initAudioContext } from './utils/audioUtils';

const MIN_FREQ = 130.81;   // C3
const MAX_FREQ = 1046.50;  // C6

// Difficulty model (logarithmic)
const DELTA_SEMITONES_START = 0.8;
const DELTA_SEMITONES_MIN = 0.05; // Slightly harder min for advanced training
const K_FACTOR = 0.15; // Slower difficulty curve for 3-note context

export default function Game4({ onExit }) {
    const [gameState, setGameState] = useState('playing');
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);

    // Notes for the sequence
    const [rootFreq, setRootFreq] = useState(0);
    const [midFreq, setMidFreq] = useState(0);
    const [targetFreq, setTargetFreq] = useState(0); // This is the 'pure' 3rd note
    const [actualFreq, setActualFreq] = useState(0); // This is the 'out of tune' 3rd note

    // For feedback and scoring logic
    const [isCorrect, setIsCorrect] = useState(null);
    const [lastGuess, setLastGuess] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [canInput, setCanInput] = useState(false);

    const audioContext = useRef(null);

    const initAudio = () => {
        if (!audioContext.current) {
            audioContext.current = initAudioContext();
        }
    };

    const handlePlayPitch = (freq, duration = 0.6) =>
        playPitch(audioContext.current, freq, duration);

    const generateNextLevel = (targetLevel) => {
        // Root note needs enough headroom for M2 and m2 above it
        const safeMin = MIN_FREQ * 1.1;
        const safeMax = MAX_FREQ / 1.5; // Avoid hitting MAX_FREQ on the 3rd note

        const root = Math.random() * (safeMax - safeMin) + safeMin;

        // M2 = 2 semitones
        const m2_ratio = Math.pow(2, 2 / 12);
        const mid = root * m2_ratio;

        // Target 3rd note is m2 above 2nd note = 1 semitone
        const minor_ratio = Math.pow(2, 1 / 12);
        const target = mid * minor_ratio;

        // Difficulty delta
        const deltaSemitones =
            DELTA_SEMITONES_START * Math.exp(-K_FACTOR * targetLevel) +
            DELTA_SEMITONES_MIN;

        const errorRatio = Math.pow(2, deltaSemitones / 12);

        let direction = Math.random() > 0.5 ? 'u' : 'd';
        const actual = direction === 'u' ? target * errorRatio : target / errorRatio;

        setRootFreq(root);
        setMidFreq(mid);
        setTargetFreq(target);
        setActualFreq(actual);

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

        // Sequence: Root -> M2 -> m2(actual)
        await handlePlayPitch(rootFreq, 0.6);
        await new Promise(r => setTimeout(r, 100));
        await handlePlayPitch(midFreq, 0.6);
        await new Promise(r => setTimeout(r, 100));

        // Input allowed as note starts
        setCanInput(true);
        await handlePlayPitch(actualFreq, 0.8);

        setIsPlaying(false);
    };

    const handleGuess = guess => {
        if (!canInput) return;

        // Compare actual played 3rd note vs target 3rd note
        const actualDirection = actualFreq > targetFreq ? 'u' : 'd';
        const won = guess === actualDirection;

        setIsCorrect(won);
        setLastGuess(guess);
        setCanInput(false);

        setTimeout(() => {
            if (won) {
                const next = level + 1;
                setLevel(next);
                generateNextLevel(next);
            } else {
                const remaining = lives - 1;
                setLives(remaining);
                if (remaining <= 0) {
                    setGameState('gameover');
                } else {
                    const next = level + 1;
                    setLevel(next);
                    generateNextLevel(next);
                }
            }
        }, 800);
    };

    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {
        if (gameState === 'playing' && rootFreq) {
            playSequence();
        }
    }, [rootFreq, gameState]);

    return (
        <>
            {gameState === 'playing' && (
                <motion.div
                    className="screen-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="playing"
                >
                    <GameHeader
                        level={level}
                        lives={lives}
                        onHome={onExit}
                    />

                    <PitchIndicator
                        isPlaying={isPlaying}
                        isCorrect={isCorrect}
                    />

                    <AnswerButtons
                        onGuess={handleGuess}
                        disabled={!canInput}
                        lastGuess={lastGuess}
                        isCorrect={isCorrect}
                    />
                </motion.div>
            )}

            {gameState === 'gameover' && (
                <GameOver
                    level={level}
                    onRestart={startGame}
                    onExit={onExit}
                />
            )}
        </>
    );
}
