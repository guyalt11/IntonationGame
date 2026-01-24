import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home({ onStartGame }) {
    return (
        <motion.div
            className="start-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div>
                <h1>Intonation</h1>
                <p style={{ opacity: 0.7, marginTop: '1rem', fontSize: '1.1rem' }}>
                    Pitch differentiation trainer
                </p>
            </div>

            <button className="primary" onClick={onStartGame}>
                <Play size={24} />
                Start Training
            </button>
        </motion.div>
    );
}
