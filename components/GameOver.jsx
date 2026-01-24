import React from 'react';
import { motion } from 'framer-motion';

export default function GameOver({ level, onRestart, onExit }) {
    return (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <button className="primary" onClick={onRestart}>
                    Try Again
                </button>
                {onExit && (
                    <button className="secondary" onClick={onExit}>
                        Back to Home
                    </button>
                )}
            </div>
        </motion.div>
    );
}
