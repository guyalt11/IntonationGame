/**
 * Plays a pitch with frequency-dependent gain compensation.
 * Lower frequencies are boosted to account for human ear sensitivity (Equal Loudness).
 */
export const playPitch = (audioContext, freq, duration = 0.8) => {
    return new Promise(resolve => {
        if (!audioContext) return resolve();

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        // Use a triangle wave for lower frequencies to make them audibly "richer" 
        // while staying smooth, or stick to sine if requested. 
        // Sine is very hard to hear at low volumes, triangle is better for training.
        osc.type = freq < 300 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);

        // Volume compensation: Lower frequencies get significantly more gain
        // C3 (130Hz) needs much more power than C6 (1046Hz)
        // Range: ~0.15 (high) to 0.7 (low)
        const baseGain = 0.15;
        const boost = Math.max(0, 1 - (freq - 130) / (1046 - 130));
        const normalizedGain = baseGain + (boost * 0.55);

        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(normalizedGain, audioContext.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + duration);

        setTimeout(resolve, duration * 1000);
    });
};

export const initAudioContext = () => {
    return new (window.AudioContext || window.webkitAudioContext)();
};

export const createDrone = (audioContext, freq) => {
    if (!audioContext) return null;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = freq < 300 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    // Drones should be slightly quieter so they don't overpower the target note
    const baseGain = 0.08;
    const boost = Math.max(0, 1 - (freq - 130) / (1046 - 130));
    const droneGain = baseGain + (boost * 0.2);

    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(droneGain, audioContext.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();

    return {
        stop: () => {
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            setTimeout(() => osc.stop(), 500);
        }
    };
};
