import React from 'react';
import { Play, Music, Shuffle, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const GAMES = [
    {
        id: 1,
        title: "Random Start",
        desc: "New random starting note every level.",
        icon: <Shuffle size={24} />,
        color: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)"
    },
    {
        id: 2,
        title: "Consecutive",
        desc: "Each note becomes the next reference.",
        icon: <Waves size={24} />,
        color: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
    },
    {
        id: 3,
        title: "Drone Mode",
        desc: "A constant reference tone plays non-stop.",
        icon: <Music size={24} />,
        color: "linear-gradient(135deg, #ec4899 0%, #d946ef 100%)"
    }
];

export default function Home({ onStartGame1, onStartGame2, onStartGame3 }) {
    const handlers = [onStartGame1, onStartGame2, onStartGame3];

    return (
        <motion.div
            className="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ justifyContent: 'center', gap: '2rem' }}
        >
            <div style={{ marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '3rem' }}>Intonation</h1>
                <p style={{ opacity: 0.6, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Master your pitch perception
                </p>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
                padding: '0 1rem'
            }}>
                {GAMES.map((game, i) => (
                    <motion.button
                        key={game.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlers[i]}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            padding: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                            flexDirection: 'row'
                        }}
                    >
                        <div style={{
                            background: game.color,
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                            {game.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{game.title}</h3>
                            <p style={{ margin: '0.2rem 0 0', opacity: 0.5, fontSize: '0.9rem', lineHeight: 1.3 }}>
                                {game.desc}
                            </p>
                        </div>
                        <Play size={20} style={{ opacity: 0.3 }} />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
