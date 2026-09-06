import {
  ALL_ITEM_DEFS,
  BACKGROUND_SRC,
  BAD_ITEMS,
  BONUS_ITEM,
  GAME_H,
  GAME_W,
  loadImage,
  NORMAL_ITEMS,
  PLAYER_SPRITES,
} from "./assets";
import { GameAudio } from "./audio";
import { loadSave, writeSave } from "./save";
import type {
  HudSnapshot,
  ItemDef,
  ItemType,
  PlayerReaction,
  SpriteKey,
} from "./types";
import { MAX_LIVES } from "./types";

const PLAYER_SIZE = 64;
const ITEM_SIZE = 68;
const PLAYER_Y_OFFSET = 96;
const PLAYER_SPEED = 520;
const PLAYER_TARGET_HEIGHT = 165;
const CROUCH_TARGET_HEIGHT = 108;

const WAVE_LABELS = [
  { t: 0, label: "Разгон" },
  { t: 18, label: "Темп" },
  { t: 36, label: "Жара" },
  { t: 54, label: "Шторм" },
] as const;

interface FallingItem {
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
  type: ItemType;
  def: ItemDef;
  image: HTMLImageElement | null;
  active: boolean;
  trail: { x: number; y: number; rot: number }[];
  drip: number;
}

type ParticleKind = "dot" | "star" | "heart" | "ring" | "spark" | "shard" | "dust";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  kind: ParticleKind;
  rot: number;
  vr: number;
  active: boolean;
}

interface Floater {
  x: number;
  y: number;
  text: string;
  life: number;
  max: number;
  color: string;
  active: boolean;
}

export type HudListener = (hud: HudSnapshot) => void;

export class SushkaGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private onHud: HudListener;
  private audio = new GameAudio();
  private raf = 0;
  private lastTs = 0;
  private running = false;
  private destroyed = false;

  private images = new Map<string, HTMLImageElement>();
  private bg: HTMLImageElement | null = null;
  private playerSprites = new Map<SpriteKey, HTMLImageElement>();

  private playerX = GAME_W / 2;
  private playerY = GAME_H - PLAYER_Y_OFFSET;
  private moveDir = 0;
  private pointerX: number | null = null;
  private facing = 1;
  private walkFrame = 0;
  private walkTimer = 0;
  private walkPhase = 0;
  private reaction: PlayerReaction = null;
  private reactionTimer = 0;
  private reactionMax = 0.3;
  private flashRgb = "196, 92, 92";

  private items: FallingItem[] = [];
  private itemPool: FallingItem[] = [];
  private particles: Particle[] = [];
  private floaters: Floater[] = [];

  private score = 0;
  private lives = 3;
  private combo = 0;
  private bestCombo = 0;
  private dodges = 0;
  private elapsed = 0;
  private spawnTimer = 0;
  private spawnInterval = 1.1;
  private lastBadStreak = 0;
  private phase: HudSnapshot["phase"] = "loading";
  private muted = false;
  private bestScore = 0;
  private savedBestCombo = 0;
  private isNewBest = false;
  private trauma = 0;
  private flash = 0;
  private lastHudKey = "";
  private dpr = 1;
  private inputReadyAt = 0;

  constructor(canvas: HTMLCanvasElement, onHud: HudListener) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D недоступен");
    this.ctx = ctx;
    this.onHud = onHud;
    const save = loadSave();
    this.bestScore = save.bestScore;
    this.savedBestCombo = save.bestCombo;
    this.muted = save.muted;
    this.audio.setMuted(save.muted);
    this.resize();
    this.emitHud();
  }

  async load() {
    try {
      this.bg = await loadImage(BACKGROUND_SRC);
      const idle = await loadImage(PLAYER_SPRITES.idle);
      this.playerSprites.set("idle", idle);
      this.images.set(PLAYER_SPRITES.idle, idle);
      this.phase = "menu";
      this.draw();
      this.emitHud();

      const rest: Promise<void>[] = [];
      (Object.keys(PLAYER_SPRITES) as SpriteKey[]).forEach((key) => {
        if (key === "idle") return;
        rest.push(
          loadImage(PLAYER_SPRITES[key]).then((img) => {
            this.playerSprites.set(key, img);
            this.images.set(PLAYER_SPRITES[key], img);
          }),
        );
      });
      ALL_ITEM_DEFS.forEach((def) => {
        rest.push(
          loadImage(def.src).then((img) => {
            this.images.set(def.src, img);
          }),
        );
      });
      await Promise.all(rest);
      if (this.destroyed) return;
      this.draw();
      this.emitHud();
    } catch (err) {
      this.phase = "menu";
      this.emitHud({
        loadError: err instanceof Error ? err.message : "Ошибка загрузки",
      });
      this.draw();
    }
  }

  startRun() {
    this.audio.unlock();
    this.audio.setPaused(false);
    this.audio.start();
    this.resetRun();
    this.phase = "playing";
    this.running = true;
    this.lastTs = 0;
    this.inputReadyAt = performance.now() + 280;
    this.emitHud();
    this.loop();
  }

  pause() {
    if (this.phase !== "playing") return;
    this.phase = "paused";
    this.running = false;
    this.audio.setPaused(true);
    this.emitHud();
  }

  resume() {
    if (this.phase !== "paused") return;
    this.audio.unlock();
    this.audio.setPaused(false);
    this.audio.playMusic("game");
    this.phase = "playing";
    this.running = true;
    this.lastTs = 0;
    this.emitHud();
    this.loop();
  }

  backToMenu() {
    this.running = false;
    this.phase = "menu";
    this.resetRun();
    this.audio.setPaused(false);
    this.audio.playMusic("menu");
    this.draw();
    this.emitHud();
  }

  primeAudio() {
    this.audio.unlock();
    if (this.phase === "menu" || this.phase === "over") {
      this.audio.playMusic("menu");
    } else if (this.phase === "playing" || this.phase === "paused") {
      this.audio.playMusic("game");
      this.audio.setPaused(this.phase === "paused");
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.audio.setMuted(muted);
    writeSave({ muted });
    this.emitHud();
  }

  setMoveDir(dir: number) {
    this.moveDir = dir;
  }

  setPointerX(x: number | null) {
    if (x !== null && performance.now() < this.inputReadyAt) return;
    this.pointerX = x;
  }

  canvasXFromClient(clientX: number) {
    const rect = this.canvas.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * GAME_W;
  }

  resize() {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(GAME_W * this.dpr);
    this.canvas.height = Math.round(GAME_H * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw();
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.audio.stopAll();
  }

  private resetRun() {
    this.playerX = GAME_W / 2;
    this.moveDir = 0;
    this.pointerX = null;
    this.facing = 1;
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.walkPhase = 0;
    this.reaction = null;
    this.reactionTimer = 0;
    this.reactionMax = 0.3;
    this.items.forEach((item) => this.releaseItem(item));
    this.items = [];
    this.particles.forEach((p) => {
      p.active = false;
    });
    this.floaters.forEach((f) => {
      f.active = false;
    });
    this.score = 0;
    this.lives = 3;
    this.combo = 0;
    this.bestCombo = 0;
    this.dodges = 0;
    this.elapsed = 0;
    this.spawnTimer = 0.35;
    this.spawnInterval = 1.1;
    this.lastBadStreak = 0;
    this.isNewBest = false;
    this.trauma = 0;
    this.flash = 0;
  }

  private loop = (ts?: number) => {
    if (!this.running || this.destroyed) return;
    const now = ts ?? performance.now();
    if (!this.lastTs) this.lastTs = now;
    let dt = (now - this.lastTs) / 1000;
    this.lastTs = now;
    dt = Math.min(dt, 0.1);
    this.update(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.elapsed += dt;
    this.spawnInterval = Math.max(0.4, 1.1 - this.elapsed * 0.04);
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnItem();
    }

    const prevX = this.playerX;
    if (this.pointerX !== null) {
      const k = 1 - Math.exp(-16 * dt);
      this.playerX += (this.pointerX - this.playerX) * k;
    } else if (this.moveDir !== 0) {
      this.playerX += this.moveDir * PLAYER_SPEED * dt;
    }
    this.playerX = Math.max(
      PLAYER_SIZE / 2,
      Math.min(GAME_W - PLAYER_SIZE / 2, this.playerX),
    );
    const vx = (this.playerX - prevX) / dt;
    if (Math.abs(vx) > 20) this.facing = vx > 0 ? 1 : -1;
    else if (this.moveDir !== 0) this.facing = this.moveDir;

    const moving =
      !this.reaction &&
      (this.moveDir !== 0 ||
        (this.pointerX !== null && Math.abs(this.pointerX - this.playerX) > 6));
    if (moving) {
      this.walkPhase += dt * 11;
      this.walkTimer += dt;
      if (this.walkTimer > 0.09) {
        this.walkTimer = 0;
        this.walkFrame = 1 - this.walkFrame;
        this.puff(this.playerX - this.facing * 8, this.playerY + 26, 2);
      }
    } else {
      this.walkTimer = 0;
      this.walkPhase += dt * 2.4;
    }

    if (this.reaction) {
      this.reactionTimer -= dt;
      if (this.reactionTimer <= 0) this.reaction = null;
    }

    const fallBase = Math.min(480, 170 + this.elapsed * 9);

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.vy * dt;
      item.rot += item.vr * dt;
      if (item.vy < fallBase * 0.7) item.vy += 12 * dt;

      item.drip += dt;
      if (item.drip > 0.032) {
        item.drip = 0;
        item.trail.push({ x: item.x, y: item.y, rot: item.rot });
        if (item.trail.length > 8) item.trail.shift();
        if (item.type === "bonus" && Math.random() < 0.45) {
          this.spawnParticle(
            item.x + (Math.random() - 0.5) * 18,
            item.y + 10,
            (Math.random() - 0.5) * 20,
            20 + Math.random() * 20,
            0.28,
            2,
            "#f0d27a",
            "spark",
          );
        }
      }

      if (this.overlaps(item.x, item.y, this.itemHitSize(item), this.playerX, this.playerY, PLAYER_SIZE)) {
        this.catchItem(item);
        this.releaseItem(item);
        this.items.splice(i, 1);
        if (this.lives <= 0) {
          this.endGame();
          return;
        }
        continue;
      }

      if (item.y - ITEM_SIZE / 2 > GAME_H) {
        if (item.type === "normal") {
          this.breakCombo();
          this.audio.miss();
          this.spawnFloater(item.x, GAME_H - 120, "мимо", "#c9d0d8");
          this.puff(item.x, GAME_H - 90, 5);
        } else if (item.type === "bad") {
          this.dodges += 1;
        }
        this.releaseItem(item);
        this.items.splice(i, 1);
      }
    }

    this.updateFx(dt);
    this.trauma = Math.max(0, this.trauma - dt * 1.8);
    this.flash = Math.max(0, this.flash - dt * 3.2);
    this.emitHud();
  }

  private itemHitSize(item: FallingItem) {
    return item.type === "bad" ? ITEM_SIZE * 0.9 : ITEM_SIZE;
  }

  private catchItem(item: FallingItem) {
    if (item.type === "normal") {
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      const mult = this.multiplier();
      const gained = 10 * mult;
      this.score += gained;
      this.reaction = "good";
      this.reactionTimer = 0.28;
      this.reactionMax = 0.28;
      this.audio.catchGood(this.combo);
      if (this.combo > 0 && this.combo % 5 === 0) {
        this.audio.comboHit();
        this.ring(item.x, item.y, "#ffe08a", 22);
        this.burst(item.x, item.y, "#ffe08a", 14, "star");
      }
      this.spawnFloater(item.x, item.y, `+${gained}`, "#e8eef6");
      this.burst(item.x, item.y, "#d7e8ff", 8, "dot");
      this.burst(item.x, item.y, "#ffffff", 6, "star");
      this.ring(item.x, item.y, "#cfe4ff", 16);
    } else if (item.type === "bonus") {
      this.lives = Math.min(this.lives + 1, MAX_LIVES);
      this.reaction = "bonus";
      this.reactionTimer = 0.45;
      this.reactionMax = 0.45;
      this.audio.catchBonus();
      this.spawnFloater(item.x, item.y, "+жизнь", "#f0d27a");
      this.burst(item.x, item.y, "#f0d27a", 12, "spark");
      this.burst(item.x, item.y, "#ff6b7a", 8, "heart");
      this.ring(item.x, item.y, "#f6e27a", 26);
      this.flashRgb = "240, 210, 122";
      this.flash = 0.28;
      this.trauma = Math.min(1, this.trauma + 0.12);
    } else {
      this.lives -= 1;
      this.breakCombo();
      this.reaction = "bad";
      this.reactionTimer = 0.4;
      this.reactionMax = 0.4;
      this.audio.catchBad();
      this.spawnFloater(item.x, item.y, "−жизнь", "#e07a7a");
      this.burst(item.x, item.y, "#c45c5c", 14, "shard");
      this.burst(item.x, item.y, "#2a1a1a", 8, "dot");
      this.ring(item.x, item.y, "#e07a7a", 28);
      this.flashRgb = "196, 92, 92";
      this.trauma = Math.min(1, this.trauma + 0.55);
      this.flash = 0.5;
    }
  }

  private breakCombo() {
    this.combo = 0;
  }

  private multiplier() {
    return Math.min(5, 1 + Math.floor(this.combo / 5));
  }

  private endGame() {
    this.running = false;
    this.phase = "over";
    this.audio.gameOver();
    this.isNewBest = this.score > this.bestScore;
    this.bestScore = Math.max(this.bestScore, this.score);
    this.savedBestCombo = Math.max(this.savedBestCombo, this.bestCombo);
    writeSave({ bestScore: this.bestScore, bestCombo: this.savedBestCombo });
    this.emitHud();
    this.draw();
  }

  private pickDef(): ItemDef {
    const r = Math.random();
    // 68% normal, 14% pizza, 18% alcohol — same as the original
    if (r < 0.68 || this.lastBadStreak >= 2) {
      this.lastBadStreak = 0;
      return NORMAL_ITEMS[Math.floor(Math.random() * NORMAL_ITEMS.length)];
    }
    if (r < 0.82) {
      this.lastBadStreak = 0;
      return BONUS_ITEM;
    }
    this.lastBadStreak += 1;
    return BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];
  }

  private spawnItem() {
    const def = this.pickDef();
    const item = this.itemPool.pop() ?? this.makeItem();
    const margin = ITEM_SIZE;
    let x = margin + Math.random() * (GAME_W - margin * 2);
    // keep a little spacing from the last active item
    const last = this.items[this.items.length - 1];
    if (last && Math.abs(last.x - x) < 36) {
      x = Math.max(margin, Math.min(GAME_W - margin, x + (x < GAME_W / 2 ? 70 : -70)));
    }
    const fall = Math.min(480, 170 + this.elapsed * 9) + Math.random() * 70;
    item.x = x;
    item.y = -ITEM_SIZE;
    item.vy = fall;
    item.rot = 0;
    item.vr = (Math.random() - 0.5) * 2.4;
    item.type = def.type;
    item.def = def;
    item.image = this.images.get(def.src) ?? null;
    item.active = true;
    item.trail = [];
    item.drip = 0;
    this.items.push(item);
  }

  private makeItem(): FallingItem {
    return {
      x: 0,
      y: 0,
      vy: 0,
      rot: 0,
      vr: 0,
      type: "normal",
      def: NORMAL_ITEMS[0],
      image: null,
      active: false,
      trail: [],
      drip: 0,
    };
  }

  private releaseItem(item: FallingItem) {
    item.active = false;
    if (this.itemPool.length < 24) this.itemPool.push(item);
  }

  private overlaps(ax: number, ay: number, asize: number, bx: number, by: number, bsize: number) {
    const ar = asize * 0.4;
    const br = bsize * 0.42;
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy < (ar + br) * (ar + br);
  }

  private burst(x: number, y: number, color: string, n: number, kind: ParticleKind = "dot") {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 50 + Math.random() * 200;
      this.spawnParticle(
        x,
        y,
        Math.cos(a) * s,
        Math.sin(a) * s - 50,
        0.32 + Math.random() * 0.32,
        2 + Math.random() * 3.8,
        color,
        kind,
      );
    }
  }

  private ring(x: number, y: number, color: string, size: number) {
    this.spawnParticle(x, y, 0, 0, 0.38, size, color, "ring");
  }

  private puff(x: number, y: number, n: number) {
    for (let i = 0; i < n; i++) {
      this.spawnParticle(
        x + (Math.random() - 0.5) * 10,
        y,
        (Math.random() - 0.5) * 40,
        -20 - Math.random() * 30,
        0.22,
        3 + Math.random() * 4,
        "rgba(230,220,200,0.7)",
        "dust",
      );
    }
  }

  private spawnParticle(
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,
    size: number,
    color: string,
    kind: ParticleKind,
  ) {
    const p =
      this.particles.find((q) => !q.active) ??
      (this.particles.length < 180 ? this.allocParticle() : null);
    if (!p) return;
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.life = life;
    p.max = life;
    p.size = size;
    p.color = color;
    p.kind = kind;
    p.rot = Math.random() * Math.PI;
    p.vr = (Math.random() - 0.5) * 8;
    p.active = true;
  }

  private allocParticle(): Particle {
    const p: Particle = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      max: 1,
      size: 2,
      color: "#fff",
      kind: "dot",
      rot: 0,
      vr: 0,
      active: false,
    };
    this.particles.push(p);
    return p;
  }

  private spawnFloater(x: number, y: number, text: string, color: string) {
    const f = this.floaters.find((q) => !q.active) ?? this.allocFloater();
    f.x = x;
    f.y = y;
    f.text = text;
    f.life = 0.85;
    f.max = 0.85;
    f.color = color;
    f.active = true;
  }

  private allocFloater(): Floater {
    const f: Floater = {
      x: 0,
      y: 0,
      text: "",
      life: 0,
      max: 1,
      color: "#fff",
      active: false,
    };
    this.floaters.push(f);
    return f;
  }

  private updateFx(dt: number) {
    for (const p of this.particles) {
      if (!p.active) continue;
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.kind === "ring") {
        p.size += 90 * dt;
      } else if (p.kind === "dust") {
        p.vy += 40 * dt;
        p.vx *= 0.98;
      } else {
        p.vy += 260 * dt;
      }
      if (p.life <= 0) p.active = false;
    }
    for (const f of this.floaters) {
      if (!f.active) continue;
      f.life -= dt;
      f.y -= 52 * dt;
      if (f.life <= 0) f.active = false;
    }
  }

  private spriteKey(): SpriteKey {
    if (this.reaction === "good") return "crouch";
    if (this.reaction === "bonus") return "flying";
    if (this.reaction === "bad") return "punch_stance";
    if (this.moveDir !== 0 || this.pointerX !== null) {
      const moving =
        this.moveDir !== 0 ||
        (this.pointerX !== null && Math.abs(this.pointerX - this.playerX) > 6);
      if (moving) return this.walkFrame === 0 ? "walk_a" : "walk_b";
    }
    return "idle";
  }

  private waveLabel(): string {
    let label: string = WAVE_LABELS[0].label;
    for (const w of WAVE_LABELS) {
      if (this.elapsed >= w.t) label = w.label;
    }
    return label;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    const shake = this.trauma * this.trauma;
    if (shake > 0.002) {
      const mag = shake * 10;
      ctx.translate((Math.random() - 0.5) * mag * 2, (Math.random() - 0.5) * mag * 2);
    }

    if (this.bg && this.bg.complete && this.bg.naturalWidth > 0) {
      ctx.drawImage(this.bg, 0, 0, GAME_W, GAME_H);
    } else {
      ctx.fillStyle = "#1e3c72";
      ctx.fillRect(0, 0, GAME_W, GAME_H);
    }

    for (const item of this.items) {
      const trailColor =
        item.type === "bad" ? 0.22 : item.type === "bonus" ? 0.3 : 0.2;
      for (let t = 0; t < item.trail.length; t++) {
        const ghost = item.trail[t];
        const a = ((t + 1) / (item.trail.length + 1)) * trailColor;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(ghost.x, ghost.y);
        ctx.rotate(ghost.rot);
        const s = 0.62 + a;
        ctx.scale(s, s);
        this.drawEntity(item.image, this.itemDrawSize(item), item.def.label);
        ctx.restore();
      }
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rot);
      this.drawEntity(item.image, this.itemDrawSize(item), item.def.label);
      ctx.restore();
    }

    this.drawPlayer();

    for (const p of this.particles) {
      if (!p.active) continue;
      const a = Math.max(0, p.life / p.max);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      this.drawParticle(p, a);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    ctx.font = "600 16px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const f of this.floaters) {
      if (!f.active) continue;
      const a = Math.max(0, f.life / f.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(${this.flashRgb}, ${this.flash * 0.35})`;
      ctx.fillRect(0, 0, GAME_W, GAME_H);
    }
    ctx.restore();
  }

  private drawParticle(p: Particle, a: number) {
    const ctx = this.ctx;
    const s = p.size * (0.55 + a * 0.5);
    if (p.kind === "ring") {
      ctx.globalAlpha = a * 0.7;
      ctx.lineWidth = 3 * a;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    if (p.kind === "star") {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? s : s * 0.4;
        const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const fn = i === 0 ? ctx.moveTo : ctx.lineTo;
        fn.call(ctx, Math.cos(ang) * r, Math.sin(ang) * r);
      }
      ctx.closePath();
      ctx.fill();
      return;
    }
    if (p.kind === "heart") {
      const k = s * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, k);
      ctx.bezierCurveTo(-k * 2, -k * 0.2, -k, -k * 2, 0, -k * 0.6);
      ctx.bezierCurveTo(k, -k * 2, k * 2, -k * 0.2, 0, k);
      ctx.fill();
      return;
    }
    if (p.kind === "shard") {
      ctx.fillRect(-s * 0.35, -s * 1.2, s * 0.7, s * 2.4);
      return;
    }
    if (p.kind === "spark") {
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(0, s);
      ctx.moveTo(-s * 0.6, 0);
      ctx.lineTo(s * 0.6, 0);
      ctx.stroke();
      return;
    }
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, Math.PI * 2);
    ctx.fill();
  }

  private itemDrawSize(item: FallingItem) {
    if (item.type === "bad") return 86;
    if (item.type === "bonus") return 74;
    return ITEM_SIZE;
  }

  private drawEntity(
    image: HTMLImageElement | null,
    maxSize: number,
    fallback: string,
  ) {
    const ctx = this.ctx;
    if (image && image.complete && image.naturalWidth > 0) {
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      const scale = maxSize / Math.max(iw, ih);
      const w = iw * scale;
      const h = ih * scale;
      ctx.drawImage(image, -w / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = "#c5d0dc";
      ctx.beginPath();
      ctx.arc(0, 0, maxSize * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0b1220";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(fallback, 0, 0);
    }
  }

  private drawPlayer() {
    const ctx = this.ctx;
    const key = this.spriteKey();
    const img = this.playerSprites.get(key) || this.playerSprites.get("idle");
    const bottomY = this.playerY + PLAYER_SIZE / 2;
    const x = this.playerX;
    const moving =
      !this.reaction &&
      (this.moveDir !== 0 ||
        (this.pointerX !== null && Math.abs(this.pointerX - this.playerX) > 6));
    const t = performance.now() / 1000;

    ctx.save();
    ctx.translate(x, bottomY);
    ctx.scale(this.facing, 1);

    if (this.reaction === "bonus") {
      const k = 1 - this.reactionTimer / Math.max(0.01, this.reactionMax);
      const hop = Math.sin(Math.min(1, k * 1.4) * Math.PI) * 26;
      ctx.rotate(-0.18);
      ctx.translate(0, -hop);
    } else if (this.reaction === "bad") {
      const k = this.reactionTimer / Math.max(0.01, this.reactionMax);
      ctx.translate(14 * k, 0);
    } else if (this.reaction === "good") {
      const k = this.reactionTimer / Math.max(0.01, this.reactionMax);
      ctx.scale(1 + 0.06 * k, 1 - 0.04 * k);
    } else if (moving) {
      const bob = Math.abs(Math.sin(this.walkPhase)) * 8;
      const squash = Math.sin(this.walkPhase * 2);
      ctx.rotate(0.07);
      ctx.scale(1 + squash * 0.06, 1 - squash * 0.05);
      ctx.translate(0, -bob);
    } else {
      const breathe = Math.sin(t * 2.3) * 0.018;
      ctx.scale(1 + breathe, 1 - breathe);
    }

    if (img && img.complete && img.naturalWidth > 0) {
      const targetH = key === "crouch" ? CROUCH_TARGET_HEIGHT : PLAYER_TARGET_HEIGHT;
      const scale = targetH / img.naturalHeight;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, -w / 2, -h, w, h);
    } else {
      ctx.fillStyle = "#e8eef6";
      ctx.fillRect(-24, -120, 48, 120);
    }
    ctx.restore();
  }

  private emitHud(extra?: Partial<HudSnapshot>) {
    const hud: HudSnapshot = {
      phase: this.phase,
      score: this.score,
      bestScore: this.bestScore,
      lives: this.lives,
      livesMax: MAX_LIVES,
      combo: this.combo,
      bestCombo: Math.max(this.bestCombo, this.savedBestCombo),
      multiplier: this.multiplier(),
      dodges: this.dodges,
      waveLabel: this.waveLabel(),
      muted: this.muted,
      loaded: this.phase !== "loading",
      loadError: extra?.loadError ?? null,
      isNewBest: this.isNewBest,
      ...extra,
    };
    const key = JSON.stringify(hud);
    if (key === this.lastHudKey) return;
    this.lastHudKey = key;
    this.onHud(hud);
  }
}
