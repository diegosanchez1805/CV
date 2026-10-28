import { prefersReducedMotion } from './utils';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    color: string;
}

const COLORS = ['59, 130, 246', '96, 165, 250', '139, 92, 246', '239, 68, 68', '251, 113, 133'];
const LINK_DISTANCE = 130;
const MOUSE_RADIUS = 160;

/** Red de partículas azul/roja que reacciona al mouse. */
export function initParticles(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let running = false;
    let frame = 0;
    const mouse = { x: -9999, y: -9999 };

    const createParticles = (): void => {
        const count = Math.min(Math.floor((width * height) / 14000), 110);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            r: Math.random() * 1.8 + 0.8,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));
    };

    const resize = (): void => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        createParticles();
        if (!running) draw();
    };

    const update = (p: Particle): void => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * 1.2;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
    };

    const draw = (): void => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < LINK_DISTANCE) {
                    ctx.strokeStyle = `rgba(${a.color}, ${(1 - dist / LINK_DISTANCE) * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            const mouseDist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
            if (mouseDist < MOUSE_RADIUS) {
                ctx.strokeStyle = `rgba(239, 68, 68, ${(1 - mouseDist / MOUSE_RADIUS) * 0.5})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            ctx.fillStyle = `rgba(${a.color}, 0.9)`;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const loop = (): void => {
        particles.forEach(update);
        draw();
        frame = requestAnimationFrame(loop);
    };

    const start = (): void => {
        if (running || prefersReducedMotion) return;
        running = true;
        frame = requestAnimationFrame(loop);
    };

    const stop = (): void => {
        running = false;
        cancelAnimationFrame(frame);
    };

    const host = canvas.parentElement ?? canvas;
    host.addEventListener('pointermove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    host.addEventListener('pointerleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Solo anima mientras el hero está en pantalla
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    new ResizeObserver(resize).observe(canvas);
}
