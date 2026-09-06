import {
  BAD_ITEMS,
  BONUS_ITEM,
  GAME_H,
  GAME_W,
  NORMAL_ITEMS,
} from "./assets";
import type { ItemDef, SpriteKey } from "./types";

const HORIZON = 188;
const NEAR_Y = 640;
const LANES = [-1, 0, 1] as const;
const PLAYER_Z = 0.84;

export interface RaceEnt {
  lane: number;
  z: number;
  kind: "bad" | "good" | "bonus";
  def: ItemDef;
  hit: boolean;
  pop: number;
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
  spawnCd: number;
  lastFoot: number;
  flyFlip: number;
}

export function createRace(): RaceState {
  return resetRace();
}

export function resetRace(): RaceState {
  const trees = Array.from({ length: 12 }, (_, i) => ({
    side: i % 2 === 0 ? -1 : 1,
    z: (i / 12) * 0.95,
  }));
  return {
    lane: 0,
    laneSmoothed: 0,
    speed: 0.26,
    scroll: 0,
    chase: 0.12,
    ents: [],
    trees,
    walkPhase: 0,
    dist: 0,
    invuln: 0,
    spawnCd: 0.55,
    lastFoot: 0,
    flyFlip: 1,
  };
}

export function raceChangeLane(s: RaceState, dir: number) {
  s.lane = Math.max(-1, Math.min(1, s.lane + dir));
  if (dir !== 0) s.flyFlip = dir;
}

/** Linear approach so items grow steadily as they come toward the camera. */
export function project(lane: number, z: number) {
  const t = Math.max(0, Math.min(1.2, z));
  const half = 26 + t * 198;
  return {
    x: GAME_W / 2 + lane * half * 0.68,
    y: HORIZON + t * (NEAR_Y - HORIZON),
    scale: 0.14 + t * 0.92,
    t,
  };
}

export function girlZ(chase: number) {
  // Higher z = closer to camera = behind the runner on the road.
  return 0.97 - chase * 0.11;
}

export function updateRace(
  s: RaceState,
  dt: number,
  spawn: (ent: RaceEnt) => void,
  onHit: (kind: RaceEnt["kind"], x: number, y: number) => void,
  onOver: () => void,
) {
  s.speed = Math.min(0.46, 0.26 + s.dist * 0.00022);
  s.scroll += s.speed * dt * 1.6;
  s.dist += s.speed * dt * 120;
  s.walkPhase += dt * (7.2 + s.speed * 6);
  s.invuln = Math.max(0, s.invuln - dt);
  s.chase = Math.min(1, s.chase + dt * 0.01);
  const k = 1 - Math.exp(-9 * dt);
  s.laneSmoothed += (s.lane - s.laneSmoothed) * k;

  for (const tree of s.trees) {
    tree.z += s.speed * dt;
    if (tree.z > 1.08) tree.z -= 1.18;
  }

  s.spawnCd -= dt;
  if (s.spawnCd <= 0) {
    const nearest = s.ents.reduce((m, e) => (e.z < m ? e.z : m), 1);
    if (nearest > 0.2) {
      spawnRacePattern(s, spawn);
      s.spawnCd = 1.05 - s.speed * 0.55 + Math.random() * 0.25;
    } else {
      s.spawnCd = 0.2;
    }
  }

  for (const ent of s.ents) {
    if (ent.hit) {
      ent.pop += dt / 0.28;
      continue;
    }
    ent.z += s.speed * dt;
    if (ent.z > 0.8 && ent.z < 0.9 && ent.lane === s.lane && s.invuln <= 0) {
      ent.hit = true;
      ent.pop = 0;
      const p = project(ent.lane, ent.z);
      onHit(ent.kind, p.x, p.y);
      if (ent.kind === "bad") {
        s.chase = Math.min(1, s.chase + 0.18);
        s.invuln = 0.55;
      } else if (ent.kind === "bonus") {
        s.chase = Math.max(0, s.chase - 0.14);
      } else {
        s.chase = Math.max(0, s.chase - 0.035);
      }
    }
  }
  s.ents = s.ents.filter((e) => e.z < 1.12 && e.pop < 1);

  if (s.chase >= 1) onOver();
}

function spawnRacePattern(s: RaceState, spawn: (ent: RaceEnt) => void) {
  const occupiedNear = new Set(
    s.ents.filter((e) => e.z < 0.28).map((e) => e.lane),
  );
  const free = LANES.filter((l) => !occupiedNear.has(l));
  const pick = free.length ? free : [...LANES];
  const lane = pick[(Math.random() * pick.length) | 0];
  spawnOne(spawn, lane, 0);

  if (Math.random() < 0.28) {
    const other = LANES.filter((l) => l !== lane);
    spawnOne(spawn, other[(Math.random() * other.length) | 0], -0.22);
  }
}

function spawnOne(
  spawn: (ent: RaceEnt) => void,
  lane: number,
  z: number,
) {
  const roll = Math.random();
  const kind: RaceEnt["kind"] = roll < 0.5 ? "bad" : roll < 0.86 ? "good" : "bonus";
  const def =
    kind === "bad"
      ? BAD_ITEMS[(Math.random() * BAD_ITEMS.length) | 0]
      : kind === "bonus"
        ? BONUS_ITEM
        : NORMAL_ITEMS[(Math.random() * NORMAL_ITEMS.length) | 0];
  spawn({ lane, z, kind, def, hit: false, pop: 0 });
}

export function drawRaceRoad(ctx: CanvasRenderingContext2D, s: RaceState) {
  const farL = GAME_W / 2 - 36;
  const farR = GAME_W / 2 + 36;
  const nearL = 16;
  const nearR = GAME_W - 16;

  ctx.beginPath();
  ctx.moveTo(farL, HORIZON);
  ctx.lineTo(farR, HORIZON);
  ctx.lineTo(nearR, NEAR_Y + 48);
  ctx.lineTo(nearL, NEAR_Y + 48);
  ctx.closePath();
  ctx.fillStyle = "#c9a36a";
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(farL, HORIZON);
  ctx.lineTo(farR, HORIZON);
  ctx.lineTo(nearR, NEAR_Y + 48);
  ctx.lineTo(nearL, NEAR_Y + 48);
  ctx.clip();

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 3;
  ctx.setLineDash([22, 20]);
  ctx.lineDashOffset = -s.scroll * 110;
  for (const lane of [-0.5, 0.5]) {
    const a = project(lane, 0);
    const b = project(lane, 1);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(46, 92, 48, 0.32)";
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
  opts: { flip?: number; bob?: number; squash?: number; rot?: number; alpha?: number } = {},
) {
  if (!img || !img.complete || img.naturalWidth < 1) return;
  const scale = h / img.naturalHeight;
  const w = img.naturalWidth * scale;
  const squash = opts.squash ?? 0;
  ctx.save();
  ctx.globalAlpha = opts.alpha ?? 1;
  ctx.translate(x, y - (opts.bob ?? 0));
  ctx.rotate(opts.rot ?? 0);
  ctx.scale(opts.flip ?? 1, 1);
  ctx.scale(1 + squash, 1 - squash);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
}

export function playerSprite(walkPhase: number): SpriteKey {
  return Math.sin(walkPhase) >= 0 ? "walk_a" : "walk_b";
}

export { PLAYER_Z };
