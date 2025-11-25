import { Howl } from 'howler';

// Web Audio API synthesizer for reliable, asset-free sound effects
class Synthesizer {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // UI Sounds
    playClick() {
        this.playTone(800, 'sine', 0.05, 0.1);
    }

    playPop() {
        this.playTone(600, 'triangle', 0.1, 0.1);
    }

    // Game State Sounds
    playWin() {
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.1), i * 100);
        });
    }

    playLose() {
        const now = this.ctx.currentTime;
        [300, 250, 200].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sawtooth', 0.4, 0.1), i * 150);
        });
    }

    playCountdown() {
        this.playTone(440, 'square', 0.1, 0.1);
    }

    playGo() {
        this.playTone(880, 'square', 0.4, 0.2);
    }

    // Plinko Sounds
    playBounce() {
        this.playTone(400 + Math.random() * 200, 'sine', 0.05, 0.08);
    }

    playDrop() {
        this.playTone(600, 'triangle', 0.15, 0.12);
    }

    // Hangman Sounds
    playCorrect() {
        this.playTone(800, 'sine', 0.15, 0.12);
    }

    playWrong() {
        this.playTone(200, 'sawtooth', 0.2, 0.1);
    }

    // Bingo Sounds
    playMark() {
        this.playTone(700, 'triangle', 0.08, 0.1);
    }

    playBingo() {
        // Celebratory ascending tones
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.12), i * 80);
        });
    }

    // Roulette/Spin Sounds
    playSpin() {
        this.playTone(200 + Math.random() * 100, 'square', 0.03, 0.05);
    }

    playStop() {
        this.playTone(300, 'sine', 0.3, 0.15);
    }

    // GeoMaster Sounds
    playReveal() {
        this.playTone(500, 'sine', 0.12, 0.1);
    }

    playMatch() {
        this.playTone(900, 'triangle', 0.15, 0.12);
    }

    // WhoPays Sounds
    playDrumroll() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => this.playTone(100, 'square', 0.05, 0.08), i * 50);
        }
    }

    playRevealWinner() {
        this.playTone(1000, 'sine', 0.5, 0.15);
    }

    // Generic Game Sounds
    playSuccess() {
        this.playTone(800, 'sine', 0.2, 0.12);
    }

    playError() {
        this.playTone(200, 'sawtooth', 0.15, 0.1);
    }

    playTick() {
        this.playTone(600, 'square', 0.03, 0.08);
    }

    playSwipe() {
        const freq = 400;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
}

export const SoundManager = new Synthesizer();
