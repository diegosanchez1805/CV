import { gsap } from 'gsap';
import { qs, qsa } from './utils';

/** Botones que se mueven ligeramente hacia el cursor. */
export function initMagnetic(selector: string, strength = 0.35): void {
    qsa(selector).forEach(el => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

        el.addEventListener('pointermove', e => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * strength);
            yTo((e.clientY - rect.top - rect.height / 2) * strength);
        });
        el.addEventListener('pointerleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        });
    });
}

/** Tarjetas que se inclinan en 3D con un brillo que sigue al cursor. */
export function initTilt(selector: string, maxAngle = 10): void {
    qsa(selector).forEach(el => {
        gsap.set(el, { transformPerspective: 900 });

        el.addEventListener('pointermove', e => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            el.style.setProperty('--mx', `${px * 100}%`);
            el.style.setProperty('--my', `${py * 100}%`);
            gsap.to(el, {
                rotateY: (px - 0.5) * maxAngle * 2,
                rotateX: (0.5 - py) * maxAngle * 2,
                y: -8,
                duration: 0.4,
                ease: 'power2.out',
            });
        });
        el.addEventListener('pointerleave', () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

/** Anillo con degradado que sigue al cursor y crece sobre elementos interactivos. */
export function initCursor(): void {
    const ring = qs('.cursor-ring');
    const dot = qs('.cursor-dot');
    document.documentElement.classList.add('has-cursor');

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08 });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08 });

    window.addEventListener('pointermove', e => {
        ringX(e.clientX);
        ringY(e.clientY);
        dotX(e.clientX);
        dotY(e.clientY);
        ring.classList.add('visible');
        dot.classList.add('visible');
    });

    document.addEventListener('pointerleave', () => {
        ring.classList.remove('visible');
        dot.classList.remove('visible');
    });

    qsa('a, button, .project, .chips span').forEach(el => {
        el.addEventListener('pointerenter', () => ring.classList.add('hover'));
        el.addEventListener('pointerleave', () => ring.classList.remove('hover'));
    });
}
