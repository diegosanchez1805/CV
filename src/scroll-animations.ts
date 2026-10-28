import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa } from './utils';

gsap.registerPlugin(ScrollTrigger);

/** Entrada del hero: títulos que suben desde una máscara y contadores. */
function heroIntro(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.hero .tagline', { autoAlpha: 0, letterSpacing: '18px' }, { autoAlpha: 1, letterSpacing: '5px', duration: 1.2 })
        .fromTo('.hero h1 .line-inner', { yPercent: 115, rotate: 4, autoAlpha: 1 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.15 }, '-=0.9')
        .fromTo(
            ['.typing-line', '.hero-sub', '.hero-actions > *', '.hero-stats li', '.scroll-indicator'],
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 },
            '-=0.6',
        );

    qsa('[data-count]').forEach(el => {
        const counter = { value: 0 };
        tl.to(counter, {
            value: Number(el.dataset.count),
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = String(Math.round(counter.value)); },
        }, 0.9);
    });
}

/** Elementos .reveal que aparecen en grupo al entrar en pantalla. */
function reveals(): void {
    gsap.set('.reveal', { y: 50 });
    ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
        }),
    });
}

/** Barras de habilidades que se llenan al verlas. */
function skillBars(): void {
    qsa('.bar i').forEach(bar => {
        gsap.to(bar, {
            width: bar.style.getPropertyValue('--w'),
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: bar, start: 'top 92%' },
        });
    });
}

/** La línea del timeline se dibuja conforme haces scroll y cada punto se enciende. */
function timeline(): void {
    const container = qs('.timeline');
    gsap.fromTo('.timeline-line', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: container, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
    });

    qsa('.timeline-item .dot').forEach(dot => {
        ScrollTrigger.create({
            trigger: dot,
            start: 'top 65%',
            onEnter: () => dot.classList.add('lit'),
            onLeaveBack: () => dot.classList.remove('lit'),
        });
    });
}

/** Parallax suave de las manchas de luz y del contenido del hero. */
function parallax(): void {
    gsap.to('.hero-content', {
        yPercent: 18,
        autoAlpha: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    qsa('.blob').forEach((blob, i) => {
        gsap.to(blob, {
            yPercent: i % 2 === 0 ? 60 : -60,
            ease: 'none',
            scrollTrigger: { trigger: blob.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    });
}

/** Los títulos con degradado se "barren" de izquierda a derecha. */
function headings(): void {
    qsa('.section h2 .gradient-text').forEach(el => {
        gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 85%' },
        });
    });
}

export function initScrollAnimations(): void {
    heroIntro();
    reveals();
    skillBars();
    timeline();
    parallax();
    headings();
}
