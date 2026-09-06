import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { SushkaGame } from "@/game/engine";
import type { HudSnapshot } from "@/game/types";
import { cn } from "@/lib/utils";

const INITIAL: HudSnapshot = {
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
  isNewBest: false,
  mode: "catch",
  chase: 0,
};

export function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<SushkaGame | null>(null);
  const holdRef = useRef(0);
  const swipeRef = useRef<number | null>(null);
  const hudRef = useRef<HudSnapshot>(INITIAL);
  const [hud, setHud] = useState<HudSnapshot>(INITIAL);
  const [boot, setBoot] = useState(true);
  hudRef.current = hud;

  useEffect(() => {
    const t = window.setTimeout(() => setBoot(false), 1200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const tg = (
      window as unknown as {
        Telegram?: {
          WebApp?: {
            ready: () => void;
            expand: () => void;
            disableVerticalSwipes?: () => void;
          };
        };
      }
    ).Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
    tg?.disableVerticalSwipes?.();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = new SushkaGame(canvas, setHud);
    gameRef.current = game;
    void game.load();

    const onResize = () => game.resize();
    const onKeyDown = (e: KeyboardEvent) => {
      const gameNow = gameRef.current;
      if (!gameNow) return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault();
        holdRef.current = -1;
        gameNow.primeAudio();
        gameNow.setMoveDir(-1);
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault();
        holdRef.current = 1;
        gameNow.primeAudio();
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
    const onKeyUp = (e: KeyboardEvent) => {
      const gameNow = gameRef.current;
      if (!gameNow) return;
      const left = e.code === "ArrowLeft" || e.code === "KeyA";
      const right = e.code === "ArrowRight" || e.code === "KeyD";
      if ((holdRef.current === -1 && left) || (holdRef.current === 1 && right)) {
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
      if (document.hidden && hudRef.current.phase === "playing") {
        gameRef.current?.pause();
      }
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

  const startHold = useCallback((dir: number) => {
    holdRef.current = dir;
    gameRef.current?.primeAudio();
    gameRef.current?.setMoveDir(dir);
  }, []);
  const endHold = useCallback((dir: number) => {
    if (holdRef.current === dir) {
      holdRef.current = 0;
      gameRef.current?.setMoveDir(0);
    }
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (hudRef.current.phase !== "playing") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const x = gameRef.current?.canvasXFromClient(e.clientX) ?? 0;
    if (hudRef.current.mode === "race") {
      swipeRef.current = x;
      return;
    }
    gameRef.current?.setPointerX(x);
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (hudRef.current.phase !== "playing") return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    if (hudRef.current.mode === "race") return;
    const x = gameRef.current?.canvasXFromClient(e.clientX) ?? 0;
    gameRef.current?.setPointerX(x);
  };
  const onPointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (hudRef.current.mode === "race" && swipeRef.current !== null) {
      const x = gameRef.current?.canvasXFromClient(e.clientX) ?? swipeRef.current;
      const dx = x - swipeRef.current;
      if (dx > 36) gameRef.current?.changeLane(1);
      else if (dx < -36) gameRef.current?.changeLane(-1);
      swipeRef.current = null;
    }
    gameRef.current?.setPointerX(null);
  };

  const playing = hud.phase === "playing";
  const showBoot = hud.phase === "loading" || (boot && hud.phase === "menu");

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-bg text-fg">
      <div
        className="relative isolate overflow-hidden bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        style={{
          width: "min(100dvw, calc(100dvh * 480 / 800))",
          height: "min(100dvh, calc(100dvw * 800 / 480))",
        }}
        onPointerDown={() => gameRef.current?.primeAudio()}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        {playing && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 pt-[max(12px,env(safe-area-inset-top))]">
              <div className="rounded-[20px] bg-bg/55 px-3 py-2 backdrop-blur-[2px]">
                <p className="font-display text-[11px] tracking-wide text-muted uppercase">
                  Счёт
                </p>
                <p className="font-display text-2xl leading-none tabular-nums">
                  {hud.score}
                </p>
                <p className="mt-1 text-[11px] text-subtle tabular-nums">
                  Рекорд {hud.bestScore}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                {hud.combo > 1 && (
                  <div className="rounded-full bg-bg/55 px-3 py-1 font-display text-sm tabular-nums backdrop-blur-[2px]">
                    комбо {hud.combo}
                    {hud.multiplier > 1 ? ` · ×${hud.multiplier}` : ""}
                  </div>
                )}
                <div className="rounded-full bg-bg/45 px-2.5 py-1 text-[11px] tracking-wide text-muted uppercase">
                  {hud.waveLabel}
                </div>
                {hud.mode === "race" && (
                  <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-black/40">
                    <div
                      className="h-full rounded-full bg-[#ff5d73]"
                      style={{ width: `${Math.round(hud.chase * 100)}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="rounded-[20px] bg-bg/55 px-3 py-2 backdrop-blur-[2px]">
                <p className="font-display text-[11px] tracking-wide text-muted uppercase">
                  Жизни
                </p>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: Math.max(hud.lives, 0) }).map((_, i) => (
                    <Heart
                      key={i}
                      className="size-4 fill-danger text-danger"
                      strokeWidth={1.5}
                    />
                  ))}
                  {hud.lives <= 0 && (
                    <span className="text-xs text-muted">0</span>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute right-3 top-[6.5rem] flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                aria-label="Пауза"
                onClick={() => gameRef.current?.pause()}
              >
                <Pause className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                aria-label={hud.muted ? "Включить звук" : "Выключить звук"}
                onClick={() => gameRef.current?.setMuted(!hud.muted)}
              >
                {hud.muted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </Button>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-between p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              <HoldButton
                label="Влево"
                onHold={() => startHold(-1)}
                onRelease={() => endHold(-1)}
              >
                <ChevronLeft className="size-7" />
              </HoldButton>
              <HoldButton
                label="Вправо"
                onHold={() => startHold(1)}
                onRelease={() => endHold(1)}
              >
                <ChevronRight className="size-7" />
              </HoldButton>
            </div>
          </>
        )}

        {hud.phase === "menu" && !showBoot && (
          <MenuScreen
            bestScore={hud.bestScore}
            bestCombo={hud.bestCombo}
            muted={hud.muted}
            loadError={hud.loadError}
            onStart={() => {
              gameRef.current?.primeAudio();
              gameRef.current?.startRun("catch");
            }}
            onRace={() => {
              gameRef.current?.primeAudio();
              gameRef.current?.startRace();
            }}
            onMute={() => {
              gameRef.current?.primeAudio();
              gameRef.current?.setMuted(!hud.muted);
            }}
          />
        )}

        {(hud.phase === "paused" || hud.phase === "over") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/62 px-6 text-center backdrop-blur-[2px]">
            {hud.phase === "paused" && (
              <div className="flex w-full max-w-[320px] flex-col items-center gap-5">
                <h1 className="font-display text-3xl">Пауза</h1>
                <p className="text-sm text-muted">Счёт {hud.score}</p>
                <div className="flex w-full flex-col gap-2">
                  <Button size="pill" onClick={() => gameRef.current?.resume()}>
                    <Play className="size-4" />
                    Продолжить
                  </Button>
                  <Button
                    variant="secondary"
                    size="pill"
                    onClick={() => gameRef.current?.backToMenu()}
                  >
                    В меню
                  </Button>
                </div>
              </div>
            )}

            {hud.phase === "over" && (
              <div className="flex w-full max-w-[320px] flex-col items-center gap-5">
                <p className="text-[11px] tracking-[0.18em] text-muted uppercase">
                  Игра окончена
                </p>
                <h1 className="font-display text-4xl tabular-nums">{hud.score}</h1>
                {hud.isNewBest && (
                  <p className="rounded-full bg-surface-elevated px-3 py-1 text-xs text-fg">
                    Новый рекорд
                  </p>
                )}
                <div className="grid w-full grid-cols-2 gap-2 text-sm">
                  <Stat label="Рекорд" value={String(hud.bestScore)} />
                  <Stat label="Комбо" value={String(hud.bestCombo)} />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Button
                    size="pill"
                    className="bg-[#ffd24a] text-[#1a1408] hover:opacity-95"
                    onClick={() => gameRef.current?.startRun()}
                  >
                    Ещё раз
                  </Button>
                  <Button
                    variant="secondary"
                    size="pill"
                    onClick={() => gameRef.current?.backToMenu()}
                  >
                    В меню
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/8 px-3 py-2">
      <p className="text-[11px] tracking-wide text-white/55 uppercase">{label}</p>
      <p className="font-display text-lg tabular-nums text-white">{value}</p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b1220]">
      <img
        src="/game/ui/splash.png?v=8"
        alt="BABY ZOV"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-9 pt-16">
        <p className="text-center font-display text-[13px] tracking-[0.32em] text-white uppercase">
          Загрузка
        </p>
        <div className="mx-auto mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-white/25">
          <div className="load-bar-run h-full w-16 rounded-full bg-[#ffd24a]" />
        </div>
      </div>
    </div>
  );
}

function MenuScreen({
  bestScore,
  bestCombo,
  muted,
  loadError,
  onStart,
  onRace,
  onMute,
}: {
  bestScore: number;
  bestCombo: number;
  muted: boolean;
  loadError: string | null;
  onStart: () => void;
  onRace: () => void;
  onMute: () => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b1220]">
      <img
        src="/game/ui/splash.png?v=8"
        alt=""
        className="absolute inset-x-0 top-0 h-[54%] w-full object-cover object-[center_22%]"
      />
      <div className="absolute inset-x-0 top-[48%] h-16 bg-gradient-to-b from-transparent to-[#10151f]" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-[#10151f] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-white/20" />
        <p className="text-center text-[13px] leading-snug font-medium text-white">
          Папа слился. Подгузники сами себя не поймают.
        </p>

        <div className="grid grid-cols-3 gap-2 text-left text-[11px]">
          <RuleCard src="/game/items/teddy_bear.png" title="Лови" body="+очки" />
          <RuleCard src="/game/items/pizza.png" title="Пицца" body="+жизнь" />
          <RuleCard src="/game/items/alcohol_0.png" title="Не бери" body="−жизнь" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Рекорд" value={String(bestScore)} />
          <Stat label="Комбо" value={String(bestCombo)} />
        </div>

        {loadError && <p className="text-xs text-danger">{loadError}</p>}

        <Button
          size="pill"
          className="bg-[#ffd24a] font-display tracking-wide text-[#1a1408] hover:opacity-95"
          onClick={onStart}
        >
          Лови
        </Button>
        <Button
          size="pill"
          className="bg-[#ff5d73] font-display tracking-wide text-white hover:opacity-95"
          onClick={onRace}
        >
          Subway ZOV
        </Button>
        <Button
          variant="secondary"
          size="pill"
          className="border-white/10 bg-white/8 text-white hover:border-white/25"
          onClick={onMute}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {muted ? "Звук выключен" : "Звук включён"}
        </Button>
        <p className="pb-1 text-center text-[11px] text-white/40">
          A / D или стрелки · пауза Esc
        </p>
      </div>
    </div>
  );
}

function RuleCard({
  src,
  title,
  body,
}: {
  src: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-white/8 p-2">
      <div className="mx-auto mb-1 flex h-11 items-center justify-center">
        <img src={src} alt="" className="max-h-11 max-w-[44px] object-contain" />
      </div>
      <p className="font-medium text-white">{title}</p>
      <p className="text-white/50">{body}</p>
    </div>
  );
}

function HoldButton({
  label,
  onHold,
  onRelease,
  children,
}: {
  label: string;
  onHold: () => void;
  onRelease: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "pointer-events-auto flex size-[72px] items-center justify-center rounded-full",
        "border border-border bg-bg/45 text-fg backdrop-blur-[2px]",
        "active:bg-surface-elevated/80",
      )}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onHold();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onRelease();
      }}
      onPointerCancel={onRelease}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}
