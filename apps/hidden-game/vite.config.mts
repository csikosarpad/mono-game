import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@mono-game/shared': path.resolve(__dirname, '../../packages/shared'),
            '@mono-game/shared-ui': path.resolve(__dirname, '../../packages/shared-ui'),
            '@mono-game/shared-styles': path.resolve(__dirname, '../../packages/shared-styles'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import '@mono-game/shared-styles/tailwind.scss';`
            },
        },
    },
});
