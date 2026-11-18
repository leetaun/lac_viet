// Web Audio API procedural sound synthesizer & BGM Manager for Lạc Việt Boardgame
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgmAudio: HTMLAudioElement | null = null;
  public isBgmPlaying: boolean = false;
  private volume: number = 0.5; // Master volume (0 to 1, mặc định 50%)

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedVol = localStorage.getItem('lacviet_sound_volume');
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.volume = parsed;
          }
        }
      } catch {}

      this.initBgm();
      // Kích hoạt phát nhạc khi có tương tác đầu tiên của người chơi (vượt rào cản autoplay trình duyệt)
      const handleFirstInteraction = () => {
        if (this.enabled && !this.isBgmPlaying) {
          this.playBgm();
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
      window.addEventListener('click', handleFirstInteraction, { passive: true });
      window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
      window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initBgm() {
    if (!this.bgmAudio && typeof Audio !== 'undefined') {
      this.bgmAudio = new Audio('/audio/hello-vietnam.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.volume;
      this.bgmAudio.preload = 'auto';
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.volume;
    }
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lacviet_sound_volume', this.volume.toString());
      }
    } catch {}
  }

  public playBgm() {
    if (!this.enabled) return;
    this.init();
    this.initBgm();
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.volume;
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isBgmPlaying = true;
          })
          .catch(() => {
            // Autoplay bị trình duyệt chặn tạm thời cho đến khi click
            this.isBgmPlaying = false;
          });
      }
    }
  }

  public pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) {
      this.playBgm();
    } else {
      this.pauseBgm();
    }
  }

  // Âm thanh lắc xúc xắc (Dice roll sound)
  public playDiceRoll() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      for (let i = 0; i < 7; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180 + Math.random() * 260, now + i * 0.06);
        gain.gain.setValueAtTime(0.18 * this.volume, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.001 * this.volume), now + i * 0.06 + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.06);
      }
    } catch {
      // Audio not permitted yet
    }
  }

  // Âm thanh rút thẻ bài (Card draw swoosh)
  public playCardDraw() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.01 * this.volume, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Âm thanh đúng / Nhận Kỷ vật (Chime of success / Golden gong)
  public playSuccess() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (chord vang)
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2 * this.volume, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.001 * this.volume), now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {}
  }

  // Âm thanh thất bại / Phạt (Low penalty gong)
  public playPenalty() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.35);

      gain.gain.setValueAtTime(0.22 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.001 * this.volume), now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }

  // Âm thanh kích hoạt kỹ năng Token (Token skill activation aura)
  public playTokenSkill() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.35);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.001 * this.volume), now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }

  // Âm thanh Chiến thắng vinh quang (Grand victory fanfare)
  public playVictory() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, t: 0.0, d: 0.15 },
        { f: 523.25, t: 0.18, d: 0.15 },
        { f: 523.25, t: 0.36, d: 0.15 },
        { f: 659.25, t: 0.54, d: 0.3 },
        { f: 783.99, t: 0.88, d: 0.2 },
        { f: 1046.5, t: 1.15, d: 0.6 }
      ];

      fanfare.forEach(note => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);

        gain.gain.setValueAtTime(0.25 * this.volume, now + note.t);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.001 * this.volume), now + note.t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.t);
        osc.stop(now + note.t + note.d + 0.05);
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();

