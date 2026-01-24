import React from 'react';
import { Trophy, Heart, Home } from 'lucide-react';

export default function GameHeader({ level, lives, onHome }) {
    return (
        <div className="stats">
            <div style={{ display: 'flex', gap: '1rem' }}>
                {onHome && (
                    <button className="home-button" onClick={onHome} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                        <Home size={18} />
                    </button>
                )}
                <span><Trophy size={18} /> Lvl {level}</span>
            </div>
            <span>
                <Heart size={18} fill={lives > 0 ? "#ef4444" : "transparent"} color="#ef4444" />
                {lives}
            </span>
        </div>
    );
}
