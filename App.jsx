import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './Home';
import Game from './Game';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');

    const handleStartGame = () => {
        setCurrentPage('game');
    };

    const handleExitGame = () => {
        setCurrentPage('home');
    };

    return (
        <div className="app-container">
            <AnimatePresence mode="wait">
                {currentPage === 'home' && (
                    <Home key="home" onStartGame={handleStartGame} />
                )}
                {currentPage === 'game' && (
                    <Game key="game" onExit={handleExitGame} />
                )}
            </AnimatePresence>
        </div>
    );
}
