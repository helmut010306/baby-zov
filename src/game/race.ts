import {
  BAD_ITEMS,
  BONUS_ITEM,
  GAME_H,
  GAME_W,
  NORMAL_ITEMS,
} from "./assets";
import type { ItemDef, SpriteKey } from "./types";

const HORIZON = 176;
const NEAR_Y = 648;
const LANES = [-1, 0, 1] as const;

export interface RaceEnt {
  lane: number;
  z: number;
  kind: "bad" | "good" | "bonus";
  def: ItemDef;
  hit: boolean;
}

export interface RaceState {
  lane: number;
  laneSmoothed: number;
  speed: number;
  scroll: number;
  chase: number;
  ents: RaceEnt[];
  trees: { side: number; z: number }[];
  walkPhase: number;
  dist: number;
  invuln: number;
}

export function createRace(): RaceState {
  return resetRace();
}

export function resetRace(): RaceState {
  const trees = Array.from({ length: 10 }, (_, i) => ({
    side: i % 2 === 0 ? -1 : 1,
    z: (i / 10) * 0.9,
  }));
  return {
    lane: 0,
    laneSmoothed: 0,
    speed: 0.42,
    scroll: 0,
    chase: 0.18,
    ents: [],
    trees,
    walkPhase: 0,
    dist: 0,
    invuln: 0,
  };
}

export function raceChangeLane(s: RaceState, dir: number) {
  s.lane = Math.max(-1, Math.min(1, s.lane + dir));
}

export function project(lane: number, z: number) {
  const t = z * z * (3 - 2 * z);
  const half = 34 + t * 196;
  return {
    x: GAME_W / 2 + lane * half * 0.7,
    y: HORIZON + t * (NEAR_Y - HORIZON),
    scale: 0.1 + t * 1.05,
    t,
  };
}

export function updateRace(
  s: RaceState,
  dt: number,
  spawn: (ent: RaceEnt) => void,
  onHit: (kind: RaceEnt["kind"], x: number, y: number) => void,
  onOver: () => void,
) {
  s.speed = Math.min(0.78, 0.42 + s.dist * 0.00035);
  s.scroll += s.speed * dt * 2.4;
  s.dist += s.speed * dt * 140;
  s.walkPhase += dt * (10 + s.speed * 8);
  s.invuln = Math.max(0, s.invuln - dt);
  s.chase = Math.min(1, s.chase + dt * 0.012);
  const k = 1 - Math.exp(-12 * dt);
  s.laneSmoothed += (s.lane - s.laneSmoothed) * k;

  for (const tree of s.trees) {
    tree.z += s.speed * dt;
    if (tree.z > 1.05) tree.z -= 1.15;
  }

  if (s.ents.length < 8 && Math.random() < dt * (1.35 + s.speed)) {
    spawnRacePattern(s, spawn);
  }

  for (const ent of s.ents) {
    ent.z += s.speed * dt;
    if (ent.hit) continue;
    if (ent.z > 0.78 && ent.z < 0.93 && ent.lane === s.lane) {
      ent.hit = true;
      const p = project(ent.lane, ent.z);
      onHit(ent.kind, p.x, p.y);
      if (ent.kind === "bad") {
        s.chase = Math.min(1, s.chase + 0.22);
        s.invuln = 0.45;
      } else if (ent.kind === "bonus") {
        s.chase = Math.max(0, s.chase - 0.16);
      } else {
        s.chase = Math.max(0, s.chase - 0.04);
      }
    }
  }
  s.ents = s.ents.filter((e) => e.z < 1.08);

  if (s.chase >= 1) onOver();
}

function spawnRacePattern(s: RaceState, spawn: (ent: RaceEnt) => void) {
  const count = Math.random() < 0.55 ? 1 : 2;
  const lanes = [...LANES].sort(() => Math.random() - 0.5).slice(0, count);
  for (const lane of lanes) {
    const roll = Math.random();
    const kind: RaceEnt["kind"] = roll < 0.55 ? "bad" : roll < 0.88 ? "good" : "bonus";
    const def =
      kind === "bad"
        ? BAD_ITEMS[(Math.random() * BAD_ITEMS.length) | 0]
        : kind === "bonus"
          ? BONUS_ITEM
          : NORMAL_ITEMS[(Math.random() * NORMAL_ITEMS.length) | 0];
    spawn({ lane, z: 0.04 + Math.random() * 0.06, kind, def, hit: false });
  }
}

export function drawRaceRoad(ctx: CanvasRenderingContext2D, s: RaceState) {
  const farL = GAME_W / 2 - 40;
  const farR = GAME_W / 2 + 40;
  const nearL = 18;
  const nearR = GAME_W - 18;

  ctx.beginPath();
  ctx.moveTo(farL, HORIZON);
  ctx.lineTo(farR, HORIZON);
  ctx.lineTo(nearR, NEAR_Y + 40);
  ctx.lineTo(nearL, NEAR_Y + 40);
  ctx.closePath();
  ctx.fillStyle = "#c9a36a";
  ctx.fill();
  ctx.fillStyle = "rgba(80, 52, 24, 0.18)";
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(farL, HORIZON);
  ctx.lineTo(farR, HORIZON);
  ctx.lineTo(nearR, NEAR_Y + 40);
  ctx.lineTo(nearL, NEAR_Y + 40);
  ctx.clip();

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 16]);
  ctx.lineDashOffset = -s.scroll * 90;
  for (const lane of [-0.5, 0.5]) {
    const a = project(lane, 0.02);
    const b = project(lane, 1);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();

  // grass sides
  ctx.fillStyle = "rgba(46, 92, 48, 0.35)";
  ctx.beginPath();
  ctx.moveTo(0, HORIZON);
  ctx.lineTo(farL, HORIZON);
  ctx.lineTo(nearL, GAME_H);
  ctx.lineTo(0, GAME_H);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(GAME_W, HORIZON);
  ctx.lineTo(farR, HORIZON);
  ctx.lineTo(nearR, GAME_H);
  ctx.lineTo(GAME_W, GAME_H);
  ctx.fill();
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  h: number,
  flip = 1,
) {
  if (!img || !img.complete || img.naturalWidth < 1) return;
  const scale = h / img.naturalHeight;
  const w = img.naturalWidth * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip, 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
}

export function playerSprite(walkPhase: number, switching: boolean): SpriteKey {
  if (switching) return "walk_a";
  return Math.floor(walkPhase) % 2 === 0 ? "walk_a" : "walk_b";
}
