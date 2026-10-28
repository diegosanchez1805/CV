export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function qs<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
    const el = root.querySelector<T>(selector);
    if (!el) throw new Error(`No se encontró el elemento: ${selector}`);
    return el;
}

export function qsa<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
    return Array.from(root.querySelectorAll<T>(selector));
}
