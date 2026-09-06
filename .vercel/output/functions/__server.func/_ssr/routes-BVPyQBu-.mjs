import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pause, c as ChevronLeft, i as Play, n as Volume2, o as Heart, s as ChevronRight, t as VolumeX } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BVPyQBu-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 select-none", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.98]",
			secondary: "bg-surface-elevated text-fg border border-border hover:border-border-strong active:scale-[0.98]",
			ghost: "bg-transparent text-fg hover:bg-surface-elevated/80 active:scale-[0.98]",
			danger: "bg-danger text-fg hover:opacity-90 active:scale-[0.98]"
		},
		size: {
			md: "h-11 px-5 text-sm rounded-[var(--radius-md)]",
			lg: "h-12 px-7 text-base rounded-[var(--radius-lg)]",
			icon: "size-11 rounded-[var(--radius-md)]",
			pill: "h-12 px-8 text-base rounded-full"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var PLAYER_SPRITES = {
	idle: "/game/player/idle.png",
	walk_a: "/game/player/walk_a.png",
	walk_b: "/game/player/walk_b.png",
	flying: "/game/player/flying.png",
	crouch: "/game/player/crouch.png",
	punch_stance: "/game/player/punch_stance.png"
};
var BACKGROUND_SRC = "/game/background.png";
var NORMAL_KEYS = [
	{
		key: "diaper_bear_blue",
		label: "подгузник"
	},
	{
		key: "diaper_stars_blue",
		label: "подгузник"
	},
	{
		key: "diaper_duck",
		label: "подгузник"
	},
	{
		key: "diaper_bear_navy",
		label: "подгузник"
	},
	{
		key: "diaper_bunny_pink",
		label: "подгузник"
	},
	{
		key: "diaper_hearts_pink",
		label: "подгузник"
	},
	{
		key: "paci_blue_star",
		label: "соска"
	},
	{
		key: "paci_mickey",
		label: "соска"
	},
	{
		key: "paci_teal",
		label: "соска"
	},
	{
		key: "paci_pink_heart",
		label: "соска"
	},
	{
		key: "paci_lion",
		label: "соска"
	},
	{
		key: "paci_purple_moon",
		label: "соска"
	},
	{
		key: "bottle_bear",
		label: "бутылочка"
	},
	{
		key: "bottle_hearts_pink",
		label: "бутылочка"
	},
	{
		key: "sippy_blue_star",
		label: "поильник"
	},
	{
		key: "sippy_bunny_pink",
		label: "поильник"
	},
	{
		key: "bottle_duck_yellow",
		label: "бутылочка"
	},
	{
		key: "bottle_stars_teal",
		label: "бутылочка"
	},
	{
		key: "teddy_bear",
		label: "мишка"
	},
	{
		key: "bunny_toy",
		label: "зайка"
	},
	{
		key: "duck_toy",
		label: "уточка"
	},
	{
		key: "pyramid_toy",
		label: "пирамидка"
	},
	{
		key: "rattle_toy",
		label: "погремушка"
	},
	{
		key: "car_toy",
		label: "машинка"
	},
	{
		key: "blocks_toy",
		label: "кубики"
	}
];
var ALCOHOL = [
	{
		file: "alcohol_0.png",
		label: "Absolut"
	},
	{
		file: "alcohol_1.png",
		label: "Smirnoff"
	},
	{
		file: "alcohol_2.png",
		label: "Jack Daniel's"
	},
	{
		file: "alcohol_3.png",
		label: "Jameson"
	},
	{
		file: "alcohol_4.png",
		label: "Hennessy"
	},
	{
		file: "alcohol_5.png",
		label: "Bacardi"
	},
	{
		file: "alcohol_6.png",
		label: "Bombay"
	},
	{
		file: "alcohol_7.png",
		label: "Heineken"
	},
	{
		file: "alcohol_8.png",
		label: "Budweiser"
	},
	{
		file: "alcohol_9.png",
		label: "Corona"
	}
];
var NORMAL_ITEMS = NORMAL_KEYS.map((item) => ({
	id: item.key,
	type: "normal",
	src: `/game/items/${item.key}.png`,
	label: item.label
}));
var BONUS_ITEM = {
	id: "pizza",
	type: "bonus",
	src: "/game/items/pizza.png",
	label: "пицца"
};
var BAD_ITEMS = ALCOHOL.map((item) => ({
	id: item.file,
	type: "bad",
	src: `/game/items/${item.file}`,
	label: item.label
}));
var ALL_ITEM_DEFS = [
	...NORMAL_ITEMS,
	BONUS_ITEM,
	...BAD_ITEMS
];
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error(`Не удалось загрузить ${src}`));
		img.src = src;
	});
}
var GameAudio = class {
	ctx = null;
	master = null;
	sfx = null;
	music = null;
	bedOsc = [];
	bedExtra = [];
	bedOn = false;
	muted = false;
	unlock() {
		if (!this.ctx) {
			const Ctx = window.AudioContext || window.webkitAudioContext;
			if (!Ctx) return;
			this.ctx = new Ctx({ latencyHint: "interactive" });
			this.master = this.ctx.createGain();
			this.sfx = this.ctx.createGain();
			this.music = this.ctx.createGain();
			this.master.gain.value = this.muted ? 0 : .3;
			this.sfx.gain.value = .9;
			this.music.gain.value = .22;
			this.sfx.connect(this.master);
			this.music.connect(this.master);
			this.master.connect(this.ctx.destination);
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	setMuted(muted) {
		this.muted = muted;
		if (!this.master || !this.ctx) return;
		this.master.gain.setTargetAtTime(muted ? 0 : .3, this.ctx.currentTime, .04);
	}
	startBed() {
		this.unlock();
		if (!this.ctx || !this.music || this.bedOn) return;
		this.bedOn = true;
		const t = this.ctx.currentTime;
		const makeDrone = (freq, type, gain) => {
			const osc = this.ctx.createOscillator();
			const g = this.ctx.createGain();
			osc.type = type;
			osc.frequency.value = freq;
			g.gain.setValueAtTime(1e-4, t);
			g.gain.exponentialRampToValueAtTime(gain, t + 1.4);
			osc.connect(g);
			g.connect(this.music);
			osc.start(t);
			this.bedOsc.push(osc);
			this.bedExtra.push(g);
		};
		makeDrone(110, "sine", .07);
		makeDrone(164.81, "sine", .045);
		makeDrone(220.2, "triangle", .018);
		const bufferSize = 2 * this.ctx.sampleRate;
		const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
		const data = noiseBuffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
		const noise = this.ctx.createBufferSource();
		noise.buffer = noiseBuffer;
		noise.loop = true;
		const filter = this.ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 420;
		filter.Q.value = .7;
		const ng = this.ctx.createGain();
		ng.gain.value = .03;
		noise.connect(filter);
		filter.connect(ng);
		ng.connect(this.music);
		noise.start(t);
		this.bedExtra.push(noise, filter, ng);
	}
	stopBed() {
		if (!this.ctx || !this.bedOn) return;
		const t = this.ctx.currentTime;
		for (const node of this.bedExtra) if (node instanceof GainNode) node.gain.setTargetAtTime(1e-4, t, .12);
		const oscs = [...this.bedOsc];
		const extras = [...this.bedExtra];
		this.bedOsc = [];
		this.bedExtra = [];
		this.bedOn = false;
		window.setTimeout(() => {
			oscs.forEach((o) => {
				try {
					o.stop();
					o.disconnect();
				} catch {}
			});
			extras.forEach((n) => {
				try {
					n.disconnect();
				} catch {}
			});
		}, 400);
	}
	stopAll() {
		this.stopBed();
		if (this.ctx) {
			this.ctx.close();
			this.ctx = null;
			this.master = null;
			this.sfx = null;
			this.music = null;
		}
	}
	tone(freq, duration, type, gain = .18, slideTo, pan = 0, dest) {
		if (!this.ctx || !this.sfx || this.muted) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		const panner = this.ctx.createStereoPanner();
		panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
		osc.type = type;
		const detune = 1 + (Math.random() * 2 - 1) * .03;
		osc.frequency.setValueAtTime(freq * detune, t);
		if (slideTo !== void 0) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t + duration);
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(gain, t + .012);
		g.gain.exponentialRampToValueAtTime(1e-4, t + duration);
		osc.connect(g);
		g.connect(panner);
		panner.connect(dest ?? this.sfx);
		osc.start(t);
		osc.stop(t + duration + .02);
		osc.onended = () => {
			osc.disconnect();
			g.disconnect();
			panner.disconnect();
		};
	}
	catchGood(combo, pan = 0) {
		const bump = Math.min(combo, 12) * 8;
		this.tone(420 + bump, .09, "triangle", .16, void 0, pan);
		this.tone(640 + bump, .07, "sine", .08, void 0, pan);
	}
	catchBonus(pan = 0) {
		this.tone(392, .16, "triangle", .14, void 0, pan);
		this.tone(523, .2, "sine", .12, void 0, pan);
		this.tone(659, .24, "sine", .08, void 0, pan);
	}
	catchBad(pan = 0) {
		this.tone(180, .22, "sawtooth", .12, 70, pan);
		this.tone(90, .28, "square", .06, 50, pan);
	}
	miss() {
		this.tone(280, .14, "sine", .1, 140);
	}
	dodge(pan = 0) {
		this.tone(880, .07, "sine", .08, 1200, pan);
		this.tone(1320, .1, "triangle", .05, void 0, pan);
	}
	comboHit() {
		this.tone(520, .08, "square", .05);
		this.tone(780, .12, "triangle", .07);
		this.tone(1040, .16, "sine", .05);
	}
	gameOver() {
		this.stopBed();
		this.tone(220, .18, "triangle", .12, 140);
		this.tone(160, .32, "sine", .1, 70);
	}
	start() {
		this.tone(330, .1, "triangle", .1);
		this.tone(494, .16, "sine", .08);
		this.startBed();
	}
};
var KEY = "sushka-catch-save";
var SAVE_VERSION = 1;
var defaults = {
	version: SAVE_VERSION,
	bestScore: 0,
	bestCombo: 0,
	muted: false
};
function migrate(raw) {
	const merged = {
		...defaults,
		...raw
	};
	merged.version = SAVE_VERSION;
	merged.bestScore = Math.max(0, Number(merged.bestScore) || 0);
	merged.bestCombo = Math.max(0, Number(merged.bestCombo) || 0);
	merged.muted = Boolean(merged.muted);
	return merged;
}
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return { ...defaults };
		return migrate(JSON.parse(raw));
	} catch {
		return { ...defaults };
	}
}
function writeSave(patch) {
	const next = migrate({
		...loadSave(),
		...patch
	});
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {}
	return next;
}
var PLAYER_SIZE = 64;
var ITEM_SIZE = 68;
var PLAYER_Y_OFFSET = 90;
var PLAYER_SPEED = 520;
var PLAYER_TARGET_HEIGHT = 165;
var STANDING_REF_HEIGHT = 303;
var IDLE_REF_HEIGHT = 653;
var SCALE_SMALL = PLAYER_TARGET_HEIGHT / STANDING_REF_HEIGHT;
var SPRITE_SCALE = {
	idle: PLAYER_TARGET_HEIGHT / IDLE_REF_HEIGHT,
	walk_a: SCALE_SMALL,
	walk_b: SCALE_SMALL,
	flying: SCALE_SMALL,
	crouch: SCALE_SMALL,
	punch_stance: SCALE_SMALL
};
var WAVE_LABELS = [
	{
		t: 0,
		label: "Разгон"
	},
	{
		t: 18,
		label: "Темп"
	},
	{
		t: 36,
		label: "Жара"
	},
	{
		t: 54,
		label: "Шторм"
	}
];
var SushkaGame = class {
	canvas;
	ctx;
	onHud;
	audio = new GameAudio();
	raf = 0;
	lastTs = 0;
	running = false;
	destroyed = false;
	images = /* @__PURE__ */ new Map();
	bg = null;
	playerSprites = /* @__PURE__ */ new Map();
	playerX = 240;
	playerY = 800 - PLAYER_Y_OFFSET;
	moveDir = 0;
	pointerX = null;
	facing = 1;
	walkFrame = 0;
	walkTimer = 0;
	reaction = null;
	reactionTimer = 0;
	items = [];
	itemPool = [];
	particles = [];
	floaters = [];
	score = 0;
	lives = 3;
	combo = 0;
	bestCombo = 0;
	dodges = 0;
	elapsed = 0;
	spawnTimer = 0;
	spawnInterval = 1.1;
	lastBadStreak = 0;
	phase = "loading";
	muted = false;
	bestScore = 0;
	savedBestCombo = 0;
	isNewBest = false;
	trauma = 0;
	flash = 0;
	lastHudKey = "";
	dpr = 1;
	inputReadyAt = 0;
	constructor(canvas, onHud) {
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
			const rest = [];
			Object.keys(PLAYER_SPRITES).forEach((key) => {
				if (key === "idle") return;
				rest.push(loadImage(PLAYER_SPRITES[key]).then((img) => {
					this.playerSprites.set(key, img);
					this.images.set(PLAYER_SPRITES[key], img);
				}));
			});
			ALL_ITEM_DEFS.forEach((def) => {
				rest.push(loadImage(def.src).then((img) => {
					this.images.set(def.src, img);
				}));
			});
			await Promise.all(rest);
			if (this.destroyed) return;
			this.draw();
			this.emitHud();
		} catch (err) {
			this.phase = "menu";
			this.emitHud({ loadError: err instanceof Error ? err.message : "Ошибка загрузки" });
			this.draw();
		}
	}
	startRun() {
		this.audio.unlock();
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
		this.emitHud();
	}
	resume() {
		if (this.phase !== "paused") return;
		this.audio.unlock();
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
		this.draw();
		this.emitHud();
	}
	setMuted(muted) {
		this.muted = muted;
		this.audio.setMuted(muted);
		writeSave({ muted });
		this.emitHud();
	}
	setMoveDir(dir) {
		this.moveDir = dir;
	}
	setPointerX(x) {
		if (x !== null && performance.now() < this.inputReadyAt) return;
		this.pointerX = x;
	}
	canvasXFromClient(clientX) {
		const rect = this.canvas.getBoundingClientRect();
		return (clientX - rect.left) / rect.width * 480;
	}
	resize() {
		this.dpr = Math.min(2, window.devicePixelRatio || 1);
		this.canvas.width = Math.round(480 * this.dpr);
		this.canvas.height = Math.round(800 * this.dpr);
		this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		this.draw();
	}
	destroy() {
		this.destroyed = true;
		this.running = false;
		cancelAnimationFrame(this.raf);
	}
	resetRun() {
		this.playerX = 240;
		this.moveDir = 0;
		this.pointerX = null;
		this.facing = 1;
		this.walkFrame = 0;
		this.walkTimer = 0;
		this.reaction = null;
		this.reactionTimer = 0;
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
		this.spawnTimer = .35;
		this.spawnInterval = 1.1;
		this.lastBadStreak = 0;
		this.isNewBest = false;
		this.trauma = 0;
		this.flash = 0;
	}
	loop = (ts) => {
		if (!this.running || this.destroyed) return;
		const now = ts ?? performance.now();
		if (!this.lastTs) this.lastTs = now;
		let dt = (now - this.lastTs) / 1e3;
		this.lastTs = now;
		dt = Math.min(dt, .1);
		this.update(dt);
		this.draw();
		this.raf = requestAnimationFrame(this.loop);
	};
	update(dt) {
		this.elapsed += dt;
		this.spawnInterval = Math.max(.4, 1.1 - this.elapsed * .04);
		this.spawnTimer += dt;
		if (this.spawnTimer >= this.spawnInterval) {
			this.spawnTimer = 0;
			this.spawnItem();
		}
		const prevX = this.playerX;
		if (this.pointerX !== null) {
			const k = 1 - Math.exp(-16 * dt);
			this.playerX += (this.pointerX - this.playerX) * k;
		} else if (this.moveDir !== 0) this.playerX += this.moveDir * PLAYER_SPEED * dt;
		this.playerX = Math.max(PLAYER_SIZE / 2, Math.min(480 - PLAYER_SIZE / 2, this.playerX));
		const vx = (this.playerX - prevX) / dt;
		if (Math.abs(vx) > 20) this.facing = vx > 0 ? 1 : -1;
		else if (this.moveDir !== 0) this.facing = this.moveDir;
		if (Math.abs(vx) > 30 || this.moveDir !== 0) {
			this.walkTimer += dt;
			if (this.walkTimer > .14) {
				this.walkTimer = 0;
				this.walkFrame = 1 - this.walkFrame;
			}
		} else this.walkTimer = 0;
		if (this.reaction) {
			this.reactionTimer -= dt;
			if (this.reactionTimer <= 0) this.reaction = null;
		}
		const fallBase = Math.min(480, 170 + this.elapsed * 9);
		for (let i = this.items.length - 1; i >= 0; i--) {
			const item = this.items[i];
			item.y += item.vy * dt;
			item.rot += item.vr * dt;
			if (item.vy < fallBase * .7) item.vy += 12 * dt;
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
			if (item.y - ITEM_SIZE / 2 > 800) {
				if (item.type === "normal") {
					this.breakCombo();
					this.audio.miss();
					this.spawnFloater(item.x, 680, "мимо", "#c9d0d8");
				} else if (item.type === "bad") this.dodges += 1;
				this.releaseItem(item);
				this.items.splice(i, 1);
			}
		}
		this.updateFx(dt);
		this.trauma = Math.max(0, this.trauma - dt * 1.8);
		this.flash = Math.max(0, this.flash - dt * 3.2);
		this.emitHud();
	}
	itemHitSize(item) {
		return item.type === "bad" ? ITEM_SIZE * .9 : ITEM_SIZE;
	}
	catchItem(item) {
		if (item.type === "normal") {
			this.combo += 1;
			this.bestCombo = Math.max(this.bestCombo, this.combo);
			const gained = 10 * this.multiplier();
			this.score += gained;
			this.reaction = "good";
			this.reactionTimer = .22;
			this.audio.catchGood(this.combo);
			if (this.combo > 0 && this.combo % 5 === 0) this.audio.comboHit();
			this.spawnFloater(item.x, item.y, `+${gained}`, "#e8eef6");
			this.burst(item.x, item.y, "#d7dee8", 10);
		} else if (item.type === "bonus") {
			this.lives = Math.min(this.lives + 1, 5);
			this.reaction = "bonus";
			this.reactionTimer = .35;
			this.audio.catchBonus();
			this.spawnFloater(item.x, item.y, "+жизнь", "#9bb7a4");
			this.burst(item.x, item.y, "#cfe0d4", 16);
			this.trauma = Math.min(1, this.trauma + .18);
		} else {
			this.lives -= 1;
			this.breakCombo();
			this.reaction = "bad";
			this.reactionTimer = .35;
			this.audio.catchBad();
			this.spawnFloater(item.x, item.y, "−жизнь", "#e07a7a");
			this.burst(item.x, item.y, "#c45c5c", 18);
			this.trauma = Math.min(1, this.trauma + .55);
			this.flash = .45;
		}
	}
	breakCombo() {
		this.combo = 0;
	}
	multiplier() {
		return Math.min(5, 1 + Math.floor(this.combo / 5));
	}
	endGame() {
		this.running = false;
		this.phase = "over";
		this.audio.gameOver();
		this.isNewBest = this.score > this.bestScore;
		this.bestScore = Math.max(this.bestScore, this.score);
		this.savedBestCombo = Math.max(this.savedBestCombo, this.bestCombo);
		writeSave({
			bestScore: this.bestScore,
			bestCombo: this.savedBestCombo
		});
		this.emitHud();
		this.draw();
	}
	pickDef() {
		const r = Math.random();
		if (r < .68 || this.lastBadStreak >= 2) {
			this.lastBadStreak = 0;
			return NORMAL_ITEMS[Math.floor(Math.random() * NORMAL_ITEMS.length)];
		}
		if (r < .82) {
			this.lastBadStreak = 0;
			return BONUS_ITEM;
		}
		this.lastBadStreak += 1;
		return BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];
	}
	spawnItem() {
		const def = this.pickDef();
		const item = this.itemPool.pop() ?? this.makeItem();
		const margin = ITEM_SIZE;
		let x = margin + Math.random() * 344;
		const last = this.items[this.items.length - 1];
		if (last && Math.abs(last.x - x) < 36) x = Math.max(margin, Math.min(480 - margin, x + (x < 240 ? 70 : -70)));
		const fall = Math.min(480, 170 + this.elapsed * 9) + Math.random() * 70;
		item.x = x;
		item.y = -68;
		item.vy = fall;
		item.rot = 0;
		item.vr = (Math.random() - .5) * 2.4;
		item.type = def.type;
		item.def = def;
		item.image = this.images.get(def.src) ?? null;
		item.active = true;
		this.items.push(item);
	}
	makeItem() {
		return {
			x: 0,
			y: 0,
			vy: 0,
			rot: 0,
			vr: 0,
			type: "normal",
			def: NORMAL_ITEMS[0],
			image: null,
			active: false
		};
	}
	releaseItem(item) {
		item.active = false;
		if (this.itemPool.length < 24) this.itemPool.push(item);
	}
	overlaps(ax, ay, asize, bx, by, bsize) {
		const ar = asize * .4;
		const br = bsize * .42;
		const dx = ax - bx;
		const dy = ay - by;
		return dx * dx + dy * dy < (ar + br) * (ar + br);
	}
	burst(x, y, color, n) {
		for (let i = 0; i < n; i++) {
			const p = this.particles.find((q) => !q.active) ?? this.allocParticle();
			const a = Math.random() * Math.PI * 2;
			const s = 40 + Math.random() * 180;
			p.x = x;
			p.y = y;
			p.vx = Math.cos(a) * s;
			p.vy = Math.sin(a) * s - 40;
			p.life = .28 + Math.random() * .28;
			p.max = p.life;
			p.size = 2 + Math.random() * 3.5;
			p.color = color;
			p.active = true;
		}
	}
	allocParticle() {
		const p = {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			life: 0,
			max: 1,
			size: 2,
			color: "#fff",
			active: false
		};
		this.particles.push(p);
		return p;
	}
	spawnFloater(x, y, text, color) {
		const f = this.floaters.find((q) => !q.active) ?? this.allocFloater();
		f.x = x;
		f.y = y;
		f.text = text;
		f.life = .7;
		f.max = .7;
		f.color = color;
		f.active = true;
	}
	allocFloater() {
		const f = {
			x: 0,
			y: 0,
			text: "",
			life: 0,
			max: 1,
			color: "#fff",
			active: false
		};
		this.floaters.push(f);
		return f;
	}
	updateFx(dt) {
		for (const p of this.particles) {
			if (!p.active) continue;
			p.life -= dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vy += 280 * dt;
			if (p.life <= 0) p.active = false;
		}
		for (const f of this.floaters) {
			if (!f.active) continue;
			f.life -= dt;
			f.y -= 46 * dt;
			if (f.life <= 0) f.active = false;
		}
	}
	spriteKey() {
		if (this.reaction === "good") return "crouch";
		if (this.reaction === "bonus") return "flying";
		if (this.reaction === "bad") return "punch_stance";
		if (this.moveDir !== 0 || this.pointerX !== null) {
			if (this.moveDir !== 0 || this.pointerX !== null && Math.abs(this.pointerX - this.playerX) > 6) return this.walkFrame === 0 ? "walk_a" : "walk_b";
		}
		return "idle";
	}
	waveLabel() {
		let label = WAVE_LABELS[0].label;
		for (const w of WAVE_LABELS) if (this.elapsed >= w.t) label = w.label;
		return label;
	}
	draw() {
		const ctx = this.ctx;
		ctx.save();
		const shake = this.trauma * this.trauma;
		if (shake > .002) {
			const mag = shake * 10;
			ctx.translate((Math.random() - .5) * mag * 2, (Math.random() - .5) * mag * 2);
		}
		if (this.bg && this.bg.complete && this.bg.naturalWidth > 0) ctx.drawImage(this.bg, 0, 0, 480, 800);
		else {
			ctx.fillStyle = "#1e3c72";
			ctx.fillRect(0, 0, 480, 800);
		}
		for (const item of this.items) {
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
			ctx.globalAlpha = a;
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * (.6 + a * .4), 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		ctx.font = "600 16px Manrope, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		for (const f of this.floaters) {
			if (!f.active) continue;
			ctx.globalAlpha = Math.max(0, f.life / f.max);
			ctx.fillStyle = f.color;
			ctx.fillText(f.text, f.x, f.y);
		}
		ctx.globalAlpha = 1;
		if (this.flash > 0) {
			ctx.fillStyle = `rgba(196, 92, 92, ${this.flash * .35})`;
			ctx.fillRect(0, 0, 480, 800);
		}
		ctx.restore();
	}
	itemDrawSize(item) {
		if (item.type === "bad") return 86;
		if (item.type === "bonus") return 74;
		return ITEM_SIZE;
	}
	drawEntity(image, maxSize, fallback) {
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
			ctx.arc(0, 0, maxSize * .28, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#0b1220";
			ctx.font = "10px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(fallback, 0, 0);
		}
	}
	drawPlayer() {
		const ctx = this.ctx;
		const key = this.spriteKey();
		const img = this.playerSprites.get(key) || this.playerSprites.get("idle");
		const bottomY = this.playerY + PLAYER_SIZE / 2;
		const x = this.playerX;
		ctx.save();
		if (this.facing < 0) {
			ctx.translate(x, 0);
			ctx.scale(-1, 1);
			ctx.translate(-x, 0);
		}
		if (img && img.complete && img.naturalWidth > 0) {
			const scale = SPRITE_SCALE[key] ?? SCALE_SMALL;
			const w = img.naturalWidth * scale;
			const h = img.naturalHeight * scale;
			ctx.drawImage(img, x - w / 2, bottomY - h, w, h);
		} else {
			ctx.fillStyle = "#e8eef6";
			ctx.fillRect(x - 24, bottomY - 120, 48, 120);
		}
		ctx.restore();
	}
	emitHud(extra) {
		const hud = {
			phase: this.phase,
			score: this.score,
			bestScore: this.bestScore,
			lives: this.lives,
			livesMax: 5,
			combo: this.combo,
			bestCombo: Math.max(this.bestCombo, this.savedBestCombo),
			multiplier: this.multiplier(),
			dodges: this.dodges,
			waveLabel: this.waveLabel(),
			muted: this.muted,
			loaded: this.phase !== "loading",
			loadError: extra?.loadError ?? null,
			isNewBest: this.isNewBest,
			...extra
		};
		const key = JSON.stringify(hud);
		if (key === this.lastHudKey) return;
		this.lastHudKey = key;
		this.onHud(hud);
	}
};
var INITIAL = {
	phase: "loading",
	score: 0,
	bestScore: 0,
	lives: 3,
	livesMax: 5,
	combo: 0,
	bestCombo: 0,
	multiplier: 1,
	dodges: 0,
	waveLabel: "Разгон",
	muted: false,
	loaded: false,
	loadError: null,
	isNewBest: false
};
function GameScreen() {
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const holdRef = (0, import_react.useRef)(0);
	const hudRef = (0, import_react.useRef)(INITIAL);
	const [hud, setHud] = (0, import_react.useState)(INITIAL);
	hudRef.current = hud;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const game = new SushkaGame(canvas, setHud);
		gameRef.current = game;
		game.load();
		const onResize = () => game.resize();
		const onKeyDown = (e) => {
			const gameNow = gameRef.current;
			if (!gameNow) return;
			if (e.code === "ArrowLeft" || e.code === "KeyA") {
				e.preventDefault();
				holdRef.current = -1;
				gameNow.setMoveDir(-1);
			}
			if (e.code === "ArrowRight" || e.code === "KeyD") {
				e.preventDefault();
				holdRef.current = 1;
				gameNow.setMoveDir(1);
			}
			if (e.code === "Escape" || e.code === "KeyP") {
				e.preventDefault();
				const phase = hudRef.current.phase;
				if (phase === "playing") gameNow.pause();
				else if (phase === "paused") gameNow.resume();
			}
			if (e.code === "Space" || e.code === "Enter") {
				const phase = hudRef.current.phase;
				if (phase === "menu" || phase === "over") {
					e.preventDefault();
					gameNow.startRun();
				} else if (phase === "paused") {
					e.preventDefault();
					gameNow.resume();
				}
			}
		};
		const onKeyUp = (e) => {
			const gameNow = gameRef.current;
			if (!gameNow) return;
			const left = e.code === "ArrowLeft" || e.code === "KeyA";
			const right = e.code === "ArrowRight" || e.code === "KeyD";
			if (holdRef.current === -1 && left || holdRef.current === 1 && right) {
				holdRef.current = 0;
				gameNow.setMoveDir(0);
			}
		};
		const clearMove = () => {
			holdRef.current = 0;
			gameRef.current?.setMoveDir(0);
			gameRef.current?.setPointerX(null);
		};
		const onVisibility = () => {
			if (document.hidden && hudRef.current.phase === "playing") gameRef.current?.pause();
		};
		window.addEventListener("resize", onResize);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", clearMove);
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", clearMove);
			document.removeEventListener("visibilitychange", onVisibility);
			game.destroy();
			gameRef.current = null;
		};
	}, []);
	const startHold = (0, import_react.useCallback)((dir) => {
		holdRef.current = dir;
		gameRef.current?.setMoveDir(dir);
	}, []);
	const endHold = (0, import_react.useCallback)((dir) => {
		if (holdRef.current === dir) {
			holdRef.current = 0;
			gameRef.current?.setMoveDir(0);
		}
	}, []);
	const onPointerDown = (e) => {
		if (hudRef.current.phase !== "playing") return;
		e.currentTarget.setPointerCapture(e.pointerId);
		const x = gameRef.current?.canvasXFromClient(e.clientX) ?? 0;
		gameRef.current?.setPointerX(x);
	};
	const onPointerMove = (e) => {
		if (hudRef.current.phase !== "playing") return;
		if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
		const x = gameRef.current?.canvasXFromClient(e.clientX) ?? 0;
		gameRef.current?.setPointerX(x);
	};
	const onPointerUp = (e) => {
		if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
		gameRef.current?.setPointerX(null);
	};
	const playing = hud.phase === "playing";
	const overlay = hud.phase === "menu" || hud.phase === "paused" || hud.phase === "over" || hud.phase === "loading";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh w-full items-center justify-center bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative isolate overflow-hidden bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
			style: {
				width: "min(100dvw, calc(100dvh * 480 / 800))",
				height: "min(100dvh, calc(100dvw * 800 / 480))"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "absolute inset-0 h-full w-full touch-none",
					onPointerDown,
					onPointerMove,
					onPointerUp,
					onPointerCancel: onPointerUp
				}),
				playing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 pt-[max(12px,env(safe-area-inset-top))]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[20px] bg-bg/55 px-3 py-2 backdrop-blur-[2px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-[11px] tracking-wide text-muted uppercase",
										children: "Счёт"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl leading-none tabular-nums",
										children: hud.score
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-subtle tabular-nums",
										children: ["Рекорд ", hud.bestScore]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-1",
								children: [hud.combo > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-full bg-bg/55 px-3 py-1 font-display text-sm tabular-nums backdrop-blur-[2px]",
									children: [
										"комбо ",
										hud.combo,
										hud.multiplier > 1 ? ` · ×${hud.multiplier}` : ""
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-full bg-bg/45 px-2.5 py-1 text-[11px] tracking-wide text-muted uppercase",
									children: hud.waveLabel
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[20px] bg-bg/55 px-3 py-2 backdrop-blur-[2px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-[11px] tracking-wide text-muted uppercase",
									children: "Жизни"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex gap-0.5",
									children: [Array.from({ length: Math.max(hud.lives, 0) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
										className: "size-4 fill-danger text-danger",
										strokeWidth: 1.5
									}, i)), hud.lives <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "0"
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute right-3 top-[6.5rem] flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "Пауза",
							onClick: () => gameRef.current?.pause(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": hud.muted ? "Включить звук" : "Выключить звук",
							onClick: () => gameRef.current?.setMuted(!hud.muted),
							children: hud.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 flex justify-between p-4 pb-[max(16px,env(safe-area-inset-bottom))]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldButton, {
							label: "Влево",
							onHold: () => startHold(-1),
							onRelease: () => endHold(-1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-7" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldButton, {
							label: "Вправо",
							onHold: () => startHold(1),
							onRelease: () => endHold(1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-7" })
						})]
					})
				] }),
				overlay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center bg-bg/62 px-6 text-center backdrop-blur-[2px]",
					children: [
						hud.phase === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg text-muted",
							children: "Загрузка…"
						}),
						hud.phase === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPanel, {
							bestScore: hud.bestScore,
							bestCombo: hud.bestCombo,
							muted: hud.muted,
							loadError: hud.loadError,
							onStart: () => gameRef.current?.startRun(),
							onMute: () => gameRef.current?.setMuted(!hud.muted)
						}),
						hud.phase === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full max-w-[320px] flex-col items-center gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-3xl",
									children: "Пауза"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: ["Счёт ", hud.score]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "pill",
										onClick: () => gameRef.current?.resume(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Продолжить"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "pill",
										onClick: () => gameRef.current?.backToMenu(),
										children: "В меню"
									})]
								})
							]
						}),
						hud.phase === "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full max-w-[320px] flex-col items-center gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] tracking-[0.18em] text-muted uppercase",
									children: "Игра окончена"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-4xl tabular-nums",
									children: hud.score
								}),
								hud.isNewBest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-full bg-surface-elevated px-3 py-1 text-xs text-fg",
									children: "Новый рекорд"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid w-full grid-cols-2 gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Рекорд",
										value: String(hud.bestScore)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Комбо",
										value: String(hud.bestCombo)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "pill",
										onClick: () => gameRef.current?.startRun(),
										children: "Ещё раз"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "pill",
										onClick: () => gameRef.current?.backToMenu(),
										children: "В меню"
									})]
								})
							]
						})
					]
				})
			]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[20px] bg-surface-elevated px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg tabular-nums",
			children: value
		})]
	});
}
function MenuPanel({ bestScore, bestCombo, muted, loadError, onStart, onMute }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full max-w-[340px] flex-col items-center gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.22em] text-muted uppercase",
						children: "Крыша · ночь"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[1.85rem] leading-tight tracking-tight",
						children: "Данил Сушка ловит"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Лови детские вещи, хватай пиццу на жизнь. Бутылки отнимают жизнь. Скорость растёт — не зевай."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid w-full grid-cols-3 gap-2 text-left text-[11px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
						src: "/game/items/teddy_bear.png",
						title: "Лови",
						body: "+очки, комбо"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
						src: "/game/items/pizza.png",
						title: "Пицца",
						body: "+жизнь"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleCard, {
						src: "/game/items/alcohol_0.png",
						title: "Не бери",
						body: "−жизнь"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid w-full grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Рекорд",
					value: String(bestScore)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Лучшее комбо",
					value: String(bestCombo)
				})]
			}),
			loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-danger",
				children: loadError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "pill",
					onClick: onStart,
					children: "Играть"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					size: "pill",
					onClick: onMute,
					children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), muted ? "Звук выключен" : "Звук включён"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-subtle",
				children: "A / D или стрелки · пауза Esc"
			})
		]
	});
}
function RuleCard({ src, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[20px] bg-surface-elevated p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-1 flex h-12 items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: "max-h-12 max-w-[48px] object-contain"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium text-fg",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-subtle",
				children: body
			})
		]
	});
}
function HoldButton({ label, onHold, onRelease, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		className: cn("pointer-events-auto flex size-[72px] items-center justify-center rounded-full", "border border-border bg-bg/45 text-fg backdrop-blur-[2px]", "active:bg-surface-elevated/80"),
		onPointerDown: (e) => {
			e.preventDefault();
			e.currentTarget.setPointerCapture(e.pointerId);
			onHold();
		},
		onPointerUp: (e) => {
			e.preventDefault();
			onRelease();
		},
		onPointerCancel: onRelease,
		onContextMenu: (e) => e.preventDefault(),
		children
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScreen, {});
}
//#endregion
export { Home as component };
