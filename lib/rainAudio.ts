"use client";

export class RainAudioGenerator {
  private ctx: AudioContext | null = null;
  private backgroundSource: AudioBufferSourceNode | null = null;
  private backgroundGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private dropTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private windTimeoutId: ReturnType<typeof setTimeout> | null = null;

  start() {
    if (this.isPlaying) return;

    const AudioContextClass =
      typeof window !== "undefined" &&
      (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass();
      this.isPlaying = true;

      // Master Gain for smooth fade-in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        0.18,
        this.ctx.currentTime + 1.2
      ); // 1.2s fade-in
      this.masterGain.connect(this.ctx.destination);

      // --- Steady Background Rain Hum (Lowpassed White Noise) ---
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = 2 * sampleRate; // 2 seconds loop
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Fill buffer with white noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.backgroundSource = this.ctx.createBufferSource();
      this.backgroundSource.buffer = noiseBuffer;
      this.backgroundSource.loop = true;

      // Filter 1: Lowpass (rain rumble/humidity)
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(450, this.ctx.currentTime);

      // Filter 2: Bandpass (gives air resonance)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(350, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.backgroundGain = this.ctx.createGain();
      this.backgroundGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

      // Connect nodes
      this.backgroundSource.connect(lowpass);
      lowpass.connect(bandpass);
      bandpass.connect(this.backgroundGain);
      this.backgroundGain.connect(this.masterGain);

      this.backgroundSource.start();

      // Swell background volume like gusts of wind
      this.modulateWind();

      // Start individual pattering raindrops scheduling
      this.scheduleRaindrops();
    } catch (err) {
      console.error("Procedural rain audio initialization failed:", err);
    }
  }

  private modulateWind() {
    if (!this.ctx || !this.backgroundGain || !this.isPlaying) return;

    const runModulation = () => {
      if (!this.ctx || !this.backgroundGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;
      // Volume oscillation between 0.05 and 0.15
      const targetVolume = 0.05 + Math.random() * 0.1;
      const transitionTime = 2 + Math.random() * 3; // 2s to 5s changes
      this.backgroundGain.gain.exponentialRampToValueAtTime(
        targetVolume,
        t + transitionTime
      );
      this.windTimeoutId = setTimeout(
        runModulation,
        transitionTime * 1000
      );
    };

    runModulation();
  }

  private scheduleRaindrops() {
    const triggerDrop = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;

      const t = this.ctx.currentTime;

      // Animate individual drop: short pitch-sliding sine wave sweeps
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      osc.type = "sine";

      // Sweep from high frequency down to medium frequency (click)
      const startFreq = 1600 + Math.random() * 900;
      const endFreq = 450 + Math.random() * 300;

      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.025);

      // Envelope: instant attack, rapid decay
      dropGain.gain.setValueAtTime(0.04 + Math.random() * 0.06, t);
      dropGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      // Spatial stereo panning
      let panner: StereoPannerNode | null = null;
      if (this.ctx.createStereoPanner) {
        panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.random() * 1.6 - 0.8, t);
        osc.connect(dropGain);
        dropGain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        // Fallback for browsers that don't support StereoPanner
        osc.connect(dropGain);
        dropGain.connect(this.masterGain);
      }

      osc.start(t);
      osc.stop(t + 0.035);

      // Schedule next raindrop at random intervals
      const nextDelay = 35 + Math.random() * 115; // 35ms - 150ms
      this.dropTimeoutId = setTimeout(triggerDrop, nextDelay);
    };

    triggerDrop();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.dropTimeoutId);
    clearTimeout(this.windTimeoutId);

    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      try {
        // Smooth fade-out before stopping to avoid speaker clicks
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
        this.masterGain.gain.linearRampToValueAtTime(0, t + 0.6);
      } catch (_) {}

      setTimeout(() => {
        if (this.backgroundSource) {
          try {
            this.backgroundSource.stop();
          } catch (_) {}
        }
        if (this.ctx) {
          try {
            this.ctx.close();
          } catch (_) {}
        }
        this.ctx = null;
        this.backgroundSource = null;
        this.backgroundGain = null;
        this.masterGain = null;
      }, 700);
    }
  }
}
