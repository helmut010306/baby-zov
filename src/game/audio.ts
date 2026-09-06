export type MusicMode = "off" | "menu" | "game";

const A2 = 110;
const B2 = 123.47;
const C3 = 130.81;
const D3 = 146.83;
const E3 = 164.81;
const F3 = 174.61;
const G3 = 196;
const A3 = 220;
const E4 = 329.63;
const G4 = 392;
const A4 = 440;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;

type Step = number | 0;

const MENU_LEAD: Step[] = [
  A4, 0, C5, 0, E5, 0, C5, 0,
  A4, 0, G4, A4, C5, 0, E5, 0,
  D5, 0, C5, 0, A4, 0, G4, 0,
  A4, 0, 0, E4, A4, 0, C5, 0,
];
const MENU_BASS: Step[] = [
  A2, A2, E3, A2, A2, A2, E3, 0,
  F3, F3, C3, F3, G3, G3, D3, 0,
  A2, A2, E3, A2, A2, A2, E3, 0,
  G3, G3, D3, G3, E3, E3, B2, 0,
];

const GAME_LEAD: Step[] = [
  A4, C5, E5, A4, G5, E5, C5, A4,
  F3, A4, C5, E5, D5, C5, A4, G4,
  A4, C5, E5, C5, A4, E4, G4, A4,
  B4, C5, E5, D5, C5, A4, G4, E4,
];
const GAME_BASS: Step[] = [
  A2, A2, A2, E3, A2, A2, C3, E3,
  F3, F3, C3, F3, G3, D3, G3, E3,
  A2, A2, A2, E3, A2, C3, E3, A3,
  G3, G3, D3, G3, E3, B2, E3, A2,
];

export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfx: GainNode | null = null;
  private music: GainNode | null = null;
  private musicTimer: number | null = null;
  private nextNote = 0;
  private step = 0;
  private mode: MusicMode = "off";
  muted = false;

  unlock() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.sfx = this.ctx.createGain();
      this.music = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.32;
      this.sfx.gain.value = 0.9;
      this.music.gain.value = 0.2;
      this.sfx.connect(this.master);
      this.music.connect(this.master);
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(muted ? 0 : 0.32, this.ctx.currentTime, 0.05);
  }

  setPaused(paused: boolean) {
    if (!this.music || !this.ctx) return;
    this.music.gain.setTargetAtTime(
      paused ? 0.06 : 0.2,
      this.ctx.currentTime,
      0.08,
    );
  }

  playMusic(mode: MusicMode) {
    this.unlock();
    if (!this.ctx || !this.music) return;
    if (this.mode === mode && this.musicTimer !== null) {
      this.setPaused(false);
      return;
    }
    this.stopMusic();
    this.mode = mode;
    if (mode === "off") return;
    this.step = 0;
    this.nextNote = this.ctx.currentTime + 0.04;
    this.music.gain.setTargetAtTime(0.2, this.ctx.currentTime, 0.08);
    this.tick();
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    this.mode = "off";
  }

  stopAll() {
    this.stopMusic();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.master = null;
      this.sfx = null;
      this.music = null;
    }
  }

  private tick = () => {
    if (!this.ctx || this.mode === "off") return;
    const bpm = this.mode === "menu" ? 100 : 138;
    const stepDur = 60 / bpm / 2;
    const horizon = this.ctx.currentTime + 0.18;
    const lead = this.mode === "menu" ? MENU_LEAD : GAME_LEAD;
    const bass = this.mode === "menu" ? MENU_BASS : GAME_BASS;
    const len = lead.length;

    while (this.nextNote < horizon) {
      const i = this.step % len;
      const t = this.nextNote;
      this.chip(lead[i], t, stepDur * 0.92, "square", this.mode === "menu" ? 0.045 : 0.055);
      this.chip(bass[i], t, stepDur * 1.05, "triangle", this.mode === "menu" ? 0.07 : 0.08);
      if (this.mode === "game") {
        if (i % 2 === 0) this.hat(t, 0.018);
        if (i % 8 === 0) this.kick(t);
        if (i % 8 === 4) this.snare(t);
      } else if (i % 4 === 0) {
        this.hat(t, 0.012);
      }
      this.nextNote += stepDur;
      this.step += 1;
    }
    this.musicTimer = window.setTimeout(this.tick, 25);
  };

  private chip(
    freq: Step,
    t: number,
    dur: number,
    type: OscillatorType,
    gain: number,
  ) {
    if (!freq || !this.ctx || !this.music) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.music);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  }

  private hat(t: number, gain: number) {
    if (!this.ctx || !this.music) return;
    const dur = 0.04;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 2400;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.music);
    src.start(t);
    src.stop(t + dur);
    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      g.disconnect();
    };
  }

  private kick(t: number) {
    this.chip(140, t, 0.09, "sine", 0.09);
    this.chip(70, t, 0.12, "sine", 0.06);
  }

  private snare(t: number) {
    this.hat(t, 0.04);
    this.chip(220, t, 0.06, "triangle", 0.03);
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    gain = 0.18,
    slideTo?: number,
    pan = 0,
    dest?: GainNode,
  ) {
    if (!this.ctx || !this.sfx || this.muted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner();
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
    osc.type = type;
    const detune = 1 + (Math.random() * 2 - 1) * 0.03;
    osc.frequency.setValueAtTime(freq * detune, t);
    if (slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t + duration);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g);
    g.connect(panner);
    panner.connect(dest ?? this.sfx);
    osc.start(t);
    osc.stop(t + duration + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
      panner.disconnect();
    };
  }

  catchGood(combo: number, pan = 0) {
    const bump = Math.min(combo, 12) * 8;
    this.tone(420 + bump, 0.09, "triangle", 0.16, undefined, pan);
    this.tone(640 + bump, 0.07, "sine", 0.08, undefined, pan);
  }

  catchBonus(pan = 0) {
    this.tone(392, 0.16, "triangle", 0.14, undefined, pan);
    this.tone(523, 0.2, "sine", 0.12, undefined, pan);
    this.tone(659, 0.24, "sine", 0.08, undefined, pan);
  }

  catchBad(pan = 0) {
    this.tone(180, 0.22, "sawtooth", 0.12, 70, pan);
    this.tone(90, 0.28, "square", 0.06, 50, pan);
  }

  miss() {
    this.tone(280, 0.14, "sine", 0.1, 140);
  }

  dodge(pan = 0) {
    this.tone(880, 0.07, "sine", 0.08, 1200, pan);
    this.tone(1320, 0.1, "triangle", 0.05, undefined, pan);
  }

  comboHit() {
    this.tone(520, 0.08, "square", 0.05);
    this.tone(780, 0.12, "triangle", 0.07);
    this.tone(1040, 0.16, "sine", 0.05);
  }

  gameOver() {
    this.playMusic("off");
    this.tone(220, 0.18, "triangle", 0.12, 140);
    this.tone(160, 0.32, "sine", 0.1, 70);
    window.setTimeout(() => {
      if (!this.muted) this.playMusic("menu");
    }, 700);
  }

  start() {
    this.tone(330, 0.1, "triangle", 0.1);
    this.tone(494, 0.16, "sine", 0.08);
    this.playMusic("game");
  }
}
