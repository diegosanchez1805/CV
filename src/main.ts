import './style.css';
import { initNav } from './nav';
import { initTyping } from './typing';
import { initParticles } from './particles';
import { initScrollAnimations } from './scroll-animations';
import { initCursor, initMagnetic, initTilt } from './interactions';
import { hasFinePointer, prefersReducedMotion, qs, qsa } from './utils';

qs('#year').textContent = String(new Date().getFullYear());

initNav();
initTyping(qs('.typed'));
initParticles(qs<HTMLCanvasElement>('.particles'));

if (prefersReducedMotion) {
    // Sin animaciones: todo visible desde el inicio
    document.documentElement.classList.remove('js');
    qsa('[data-count]').forEach(el => { el.textContent = el.dataset.count ?? '0'; });
    qsa('.bar i').forEach(bar => { bar.style.width = bar.style.getPropertyValue('--w'); });
    qsa('.timeline-item .dot').forEach(dot => dot.classList.add('lit'));
} else {
    initScrollAnimations();

    if (hasFinePointer) {
        initMagnetic('.btn-main, .btn-ghost, .btn-contact');
        initTilt('.project, .info-card');
        initCursor();
    }
}
