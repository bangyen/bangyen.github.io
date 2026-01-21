import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        outDir: 'build', // Maintain 'build' for gh-pages compatibility
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor_react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
                    vendor_mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
                    vendor_recharts: ['recharts'],
                },
            },
        },
    },
    server: {
        open: true,
        port: 3000,
    },
});
