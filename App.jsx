import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './Home';
import Game1 from './Game1';
import Game2 from './Game2';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');

    const handleStartGame1 = () => {
        setCurrentPage('game1');
    };

    const handleStartGame2 = () => {
        setCurrentPage('game2');
    };

    const handleExitGame = () => {
        setCurrentPage('home');
    };

    return (
        <div className="app-container">
            <AnimatePresence mode="wait">
                {currentPage === 'home' && (
                    <Home key="home" onStartGame1={handleStartGame1} onStartGame2={handleStartGame2} />
                )}
                {currentPage === 'game1' && (
                    <Game1 key="game1" onExit={handleExitGame} />
                )}
                {currentPage === 'game2' && (
                    <Game2 key="game2" onExit={handleExitGame} />
                )}
            </AnimatePresence>
        </div>
    );
}
