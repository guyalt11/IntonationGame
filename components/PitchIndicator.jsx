import React from 'react';
import { Music } from 'lucide-react';

export default function PitchIndicator({ isPlaying, isCorrect }) {
    return (
        <div>
            <div className={`pitch-indicator ${isPlaying ? 'playing' : ''}`}>
                <Music size={32} color={isPlaying ? "#fff" : "rgba(255,255,255,0.3)"} />
            </div>
            <div className="feedback">
                {isCorrect === true && <span className="correct">Correct!</span>}
                {isCorrect === false && <span className="wrong">Wrong!</span>}
            </div>
        </div>
    );
}
