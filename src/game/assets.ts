import type { ItemDef, SpriteKey } from "./types";

export const GAME_W = 480;
export const GAME_H = 800;

export const PLAYER_SPRITES: Record<SpriteKey, string> = {
  idle: "/game/player/idle.png?v=7",
  walk_a: "/game/player/walk_a.png?v=7",
  walk_b: "/game/player/walk_b.png?v=7",
  flying: "/game/player/flying.png?v=7",
  crouch: "/game/player/crouch.png?v=7",
  punch_stance: "/game/player/punch_stance.png?v=7",
};

export const BACKGROUND_SRC = "/game/background.png?v=7";

const NORMAL_KEYS: { key: string; label: string }[] = [
  { key: "diaper_bear_blue", label: "подгузник" },
  { key: "diaper_stars_blue", label: "подгузник" },
  { key: "diaper_duck", label: "подгузник" },
  { key: "diaper_bear_navy", label: "подгузник" },
  { key: "diaper_bunny_pink", label: "подгузник" },
  { key: "diaper_hearts_pink", label: "подгузник" },
  { key: "paci_blue_star", label: "соска" },
  { key: "paci_mickey", label: "соска" },
  { key: "paci_teal", label: "соска" },
  { key: "paci_pink_heart", label: "соска" },
  { key: "paci_lion", label: "соска" },
  { key: "paci_purple_moon", label: "соска" },
  { key: "bottle_bear", label: "бутылочка" },
  { key: "bottle_hearts_pink", label: "бутылочка" },
  { key: "sippy_blue_star", label: "поильник" },
  { key: "sippy_bunny_pink", label: "поильник" },
  { key: "bottle_duck_yellow", label: "бутылочка" },
  { key: "bottle_stars_teal", label: "бутылочка" },
  { key: "teddy_bear", label: "мишка" },
  { key: "bunny_toy", label: "зайка" },
  { key: "duck_toy", label: "уточка" },
  { key: "pyramid_toy", label: "пирамидка" },
  { key: "rattle_toy", label: "погремушка" },
  { key: "car_toy", label: "машинка" },
  { key: "blocks_toy", label: "кубики" },
];

const ALCOHOL: { file: string; label: string }[] = [
  { file: "alcohol_0.png", label: "Absolut" },
  { file: "alcohol_1.png", label: "Smirnoff" },
  { file: "alcohol_2.png", label: "Jack Daniel's" },
  { file: "alcohol_3.png", label: "Jameson" },
  { file: "alcohol_4.png", label: "Hennessy" },
  { file: "alcohol_5.png", label: "Bacardi" },
  { file: "alcohol_6.png", label: "Bombay" },
  { file: "alcohol_7.png", label: "Heineken" },
  { file: "alcohol_8.png", label: "Budweiser" },
  { file: "alcohol_9.png", label: "Corona" },
];

export const NORMAL_ITEMS: ItemDef[] = NORMAL_KEYS.map((item) => ({
  id: item.key,
  type: "normal",
  src: `/game/items/${item.key}.png`,
  label: item.label,
}));

export const BONUS_ITEM: ItemDef = {
  id: "pizza",
  type: "bonus",
  src: "/game/items/pizza.png",
  label: "пицца",
};

export const BAD_ITEMS: ItemDef[] = ALCOHOL.map((item) => ({
  id: item.file,
  type: "bad",
  src: `/game/items/${item.file}`,
  label: item.label,
}));

export const ALL_ITEM_DEFS: ItemDef[] = [
  ...NORMAL_ITEMS,
  BONUS_ITEM,
  ...BAD_ITEMS,
];

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Не удалось загрузить ${src}`));
    img.src = src;
  });
}
