const KEY = "sushka-catch-save";
const SAVE_VERSION = 1;

export interface SaveData {
  version: number;
  bestScore: number;
  bestCombo: number;
  muted: boolean;
}

const defaults: SaveData = {
  version: SAVE_VERSION,
  bestScore: 0,
  bestCombo: 0,
  muted: false,
};

function migrate(raw: Partial<SaveData> & { version?: number }): SaveData {
  const merged = { ...defaults, ...raw };
  merged.version = SAVE_VERSION;
  merged.bestScore = Math.max(0, Number(merged.bestScore) || 0);
  merged.bestCombo = Math.max(0, Number(merged.bestCombo) || 0);
  merged.muted = Boolean(merged.muted);
  return merged;
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    return migrate(JSON.parse(raw) as Partial<SaveData>);
  } catch {
    return { ...defaults };
  }
}

export function writeSave(patch: Partial<SaveData>): SaveData {
  const next = migrate({ ...loadSave(), ...patch });
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode / quota — keep in-memory
  }
  return next;
}
