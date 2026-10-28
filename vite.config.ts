import { defineConfig } from 'vite';

export default defineConfig({
    // Rutas relativas para poder publicar el CV en cualquier carpeta o hosting
    base: './',
    server: { port: 5173, strictPort: true },
});
