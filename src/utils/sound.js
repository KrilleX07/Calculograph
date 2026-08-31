// Web Audio API Retro & Cyber Sound Synthesizer

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playCash() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Dual high chime
      [987.77, 1318.51, 1975.53].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        gain.gain.setValueAtTime(0, t + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, t + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.25);
      });
    } catch (e) {}
  }

  playMintSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Ascending triumphant synth arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === notes.length - 1 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.07);

        gain.gain.setValueAtTime(0, t + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.15, t + i * 0.07 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + (i === notes.length - 1 ? 0.6 : 0.2));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + (i === notes.length - 1 ? 0.6 : 0.2));
      });
    } catch (e) {}
  }

  playMythicReveal() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Golden God Laser Fanfare
      const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + i * 0.05);

        gain.gain.setValueAtTime(0, t + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.18, t + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.8);
      });
    } catch (e) {}
  }

  playToggle() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }
}

export const sound = new SoundEffects();
