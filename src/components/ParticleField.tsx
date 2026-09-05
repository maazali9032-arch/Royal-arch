import { useEffect, useRef } from "react";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  emerald: boolean;
};

const MAX = 28;

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: P[] = [];
    const spawn = (x: number, y: number) => {
      if (particles.length >= MAX) return;
      const emerald = Math.random() > 0.55;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.7 - 0.1,
        life: 0,
        max: 60 + Math.random() * 50,
        r: 0.8 + Math.random() * 2.2,
        emerald,
      });
    };

    let last = { x: 0, y: 0, set: false };
    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (last.set) {
        const d = Math.hypot(x - last.x, y - last.y);
        if (d < 6) return;
      }
      last = { x, y, set: true };
      spawn(x, y);
      if (Math.random() > 0.6) spawn(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.002;
        const t = 1 - p.life / p.max;
        if (t <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const color = p.emerald ? "16, 92, 70" : "212, 175, 55";
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, `rgba(${p.emerald ? "180, 240, 214" : "255, 240, 200"}, ${t})`);
        g.addColorStop(0.4, `rgba(${color}, ${t * 0.5})`);
        g.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
