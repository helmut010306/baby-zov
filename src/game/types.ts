export type GamePhase = "loading" | "menu" | "playing" | "paused" | "over";

export type ItemType = "normal" | "bonus" | "bad";

export type PlayerReaction = "good" | "bonus" | "bad" | null;

export type SpriteKey =
  | "idle"
  | "walk_a"
  | "walk_b"
  | "flying"
  | "crouch"
  | "punch_stance";

export interface ItemDef {
  id: string;
  type: ItemType;
  src: string;
  label: string;
}

export const MAX_LIVES = 5;

export interface HudSnapshot {
  phase: GamePhase;
  score: number;
  bestScore: number;
  lives: number;
  livesMax: number;
  combo: number;
  bestCombo: number;
  multiplier: number;
  dodges: number;
  waveLabel: string;
  muted: boolean;
  loaded: boolean;
  loadError: string | null;
  isNewBest: boolean;
}
