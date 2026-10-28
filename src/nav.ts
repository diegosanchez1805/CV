import { qs, qsa } from './utils';

export function initNav(): void {
    const navbar = qs('.navbar');
    const toggle = qs<HTMLButtonElement>('.menu-toggle');
    const navLinks = qs('.nav-links');
    const links = qsa<HTMLAnchorElement>('a', navLinks);
    const progress = qs('.scroll-progress');

    const setMenu = (open: boolean): void => {
        navLinks.classList.toggle('open', open);
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    links.forEach(link => link.addEventListener('click', () => setMenu(false)));

    // Navbar compacta + barra de progreso
    const onScroll = (): void => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        document.body.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Enlace activo según la sección visible
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    qsa('section[id]').forEach(section => observer.observe(section));
}
