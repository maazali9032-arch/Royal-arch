import { useCallback, useEffect, useRef, useState } from "react";

export function ScratchDate({ date }: { date: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const checkTick = useRef(0);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = wrap.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#8a6d20");
    g.addColorStop(0.25, "#d4af37");
    g.addColorStop(0.5, "#f4e3a1");
    g.addColorStop(0.75, "#c79c2e");
    g.addColorStop(1, "#7d5f1b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // frosted sparkle grain
    for (let i = 0; i < Math.floor(width * height * 0.02); i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const a = Math.random() * 0.35;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(90,65,10,${a})`;
      ctx.fillRect(x, y, 1, 1);
    }
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 0.8 + 0.3;
      const s = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      s.addColorStop(0, "rgba(255,255,255,0.8)");
      s.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    paintFoil();
    const onResize = () => {
      if (!revealed) paintFoil();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintFoil, revealed]);

  const clearedRatio = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const step = 8;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < img.length; i += 4 * step) {
      total++;
      const alpha = img[i];
      if (alpha !== undefined && alpha < 40) clear++;
    }
    return total ? clear / total : 0;
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 46;
    ctx.strokeStyle = "rgba(0,0,0,1)";
    const prev = lastPt.current;
    ctx.beginPath();
    if (prev) {
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y);
    }
    ctx.stroke();
    // soft feathered edge
    const rg = ctx.createRadialGradient(x, y, 4, x, y, 34);
    rg.addColorStop(0, "rgba(0,0,0,1)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
    lastPt.current = { x, y };

    checkTick.current += 1;
    if (checkTick.current % 12 === 0 && clearedRatio() > 0.4) setRevealed(true);
  };

  const pos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-center text-[0.6rem] tracking-royal text-gold/70 uppercase">
        {revealed ? "Save the date" : "Rub to reveal the date"}
      </p>
      <div
        ref={wrapRef}
        className="paper-grain relative mt-5 aspect-[5/2] w-full overflow-hidden border border-gold/40 bg-emerald-deep"
      >
        <div className="girih absolute inset-0 opacity-10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="font-display text-2xl leading-tight text-gold-foil sm:text-3xl">
            {date}
          </span>
          <span className="mt-3 block h-px w-16 bg-gold/60" />
          <span className="mt-3 text-[0.55rem] tracking-royal text-ivory/70 uppercase">
            Save the date
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
            revealed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            if (revealed) return;
            (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
            drawing.current = true;
            lastPt.current = null;
            const p = pos(e);
            if (!p) return;
            scratch(p.x, p.y);
          }}
          onPointerMove={(e) => {
            if (!drawing.current || revealed) return;
            const p = pos(e);
            if (!p) return;
            scratch(p.x, p.y);
          }}
          onPointerUp={() => {
            drawing.current = false;
            lastPt.current = null;
            if (clearedRatio() > 0.4) setRevealed(true);
          }}
          onPointerCancel={() => {
            drawing.current = false;
            lastPt.current = null;
          }}
        />
      </div>
      {!revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mx-auto mt-4 block border-b border-gold/40 pb-1 text-xs text-gold/70"
        >
          Reveal date
        </button>
      )}
    </div>
  );
}
