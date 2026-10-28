import { prefersReducedMotion } from './utils';

interface TypingOptions {
    typeSpeed: number;
    deleteSpeed: number;
    holdDelay: number;
    nextDelay: number;
}

const defaults: TypingOptions = { typeSpeed: 85, deleteSpeed: 40, holdDelay: 1800, nextDelay: 400 };

export function initTyping(el: HTMLElement, options: Partial<TypingOptions> = {}): void {
    const { typeSpeed, deleteSpeed, holdDelay, nextDelay } = { ...defaults, ...options };
    const words = (el.dataset.words ?? '').split('|').filter(Boolean);
    if (words.length === 0) return;

    if (prefersReducedMotion) {
        el.textContent = words[0];
        return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = (): void => {
        const word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        el.textContent = word.slice(0, charIndex);

        let delay = deleting ? deleteSpeed : typeSpeed;
        if (!deleting && charIndex === word.length) {
            delay = holdDelay;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = nextDelay;
        }
        window.setTimeout(tick, delay);
    };

    window.setTimeout(tick, 1200);
}
