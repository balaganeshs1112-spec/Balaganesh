class EmergencyAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentSirenOsc: OscillatorNode | null = null;
  private currentGainNode: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopSiren();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playBeep(frequency: number = 880, durationMs: number = 150, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + durationMs / 1000);
    } catch (e) {
      // Ignore audio context errors if blocked by browser policy
    }
  }

  public playEmergencyChime() {
    if (this.isMuted) return;
    this.playBeep(660, 120, 'square');
    setTimeout(() => this.playBeep(880, 150, 'square'), 140);
    setTimeout(() => this.playBeep(1100, 250, 'sine'), 300);
  }

  public playGreenWaveChime() {
    if (this.isMuted) return;
    this.playBeep(523.25, 100, 'sine'); // C5
    setTimeout(() => this.playBeep(659.25, 100, 'sine'), 110); // E5
    setTimeout(() => this.playBeep(783.99, 180, 'sine'), 220); // G5
  }

  public startSiren() {
    if (this.isMuted) return;
    this.stopSiren();

    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      // Oscillate siren frequency between 600Hz and 900Hz
      for (let i = 0; i < 20; i++) {
        osc.frequency.setValueAtTime(600, now + i * 0.8);
        osc.frequency.linearRampToValueAtTime(950, now + i * 0.8 + 0.4);
        osc.frequency.linearRampToValueAtTime(600, now + i * 0.8 + 0.8);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.currentSirenOsc = osc;
      this.currentGainNode = gain;

      setTimeout(() => {
        this.stopSiren();
      }, 16000);
    } catch (e) {
      // Ignore audio policy issues
    }
  }

  public stopSiren() {
    if (this.currentSirenOsc) {
      try {
        this.currentSirenOsc.stop();
        this.currentSirenOsc.disconnect();
      } catch (e) {}
      this.currentSirenOsc = null;
    }
  }
}

export const audioSynth = new EmergencyAudioSynthesizer();
