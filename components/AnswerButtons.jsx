import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function AnswerButtons({ onGuess, disabled, lastGuess, isCorrect }) {
    const getButtonClass = (direction) => {
        if (lastGuess !== direction) return 'secondary';
        if (isCorrect === true) return 'secondary correct';
        if (isCorrect === false) return 'secondary wrong';
        return 'secondary';
    };

    return (
        <div className="controls">
            <button
                className={getButtonClass('u')}
                onClick={() => onGuess('u')}
                disabled={disabled}
            >
                <ArrowUp size={32} />
                Higher
            </button>
            <button
                className={getButtonClass('d')}
                onClick={() => onGuess('d')}
                disabled={disabled}
            >
                <ArrowDown size={32} />
                Lower
            </button>
        </div>
    );
}
