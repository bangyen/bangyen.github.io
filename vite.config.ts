/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
    const plugins = [
        react(),
        tsconfigPaths(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.ico',
                'apple-touch-icon.png',
                'og-image.png',
            ],
            manifest: {
                name: 'Bangyen Pham - AI & Backend Portfolio',
                short_name: 'Bangyen',
                description:
                    'Interactive engineering portfolio featuring logic games and research visualizations.',
                theme_color: '#f2f2f2',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: '/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                navigateFallback: '/index.html',
                cleanupOutdatedCaches: true,
                globPatterns: ['**/*.{js,css,html,ico,png,woff2,json,gz}'],
                runtimeCaching: [
                    {
                        urlPattern: /\/.*_data\.json\.gz$/,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'research-data',
                            expiration: {
                                maxEntries: 4,
                                maxAgeSeconds: 86_400,
                            },
                        },
                    },
                ],
            },
        }),
        visualizer({
            filename: 'stats.html',
            open: !!process.env['ANALYZE'],
            gzipSize: true,
            brotliSize: true,
        }),
    ];

    return {
        plugins,
        worker: {
            format: 'es',
            plugins: () => [tsconfigPaths()],
        },
        build: {
            outDir: 'build', // Maintain 'build' for gh-pages compatibility
            // Enable source maps for production debugging (can be disabled for smaller builds)
            sourcemap: false,
            // ESBuild minification with console stripping
            esbuild: {
                drop: ['console', 'debugger'],
            },
            // CSS code splitting
            cssCodeSplit: true,
            // Chunk size warnings - reduced to catch issues earlier
            chunkSizeWarningLimit: 400, // Warn if chunks exceed 400KB
            // Asset inlining threshold (assets smaller than this will be inlined as base64)
            assetsInlineLimit: 4096, // 4KB
            rollupOptions: {
                output: {
                    // Optimize chunk file names
                    chunkFileNames: 'assets/[name]-[hash].js',
                    entryFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                    // Manual chunk splitting for better caching
                    manualChunks(id: string) {
                        if (id.includes('node_modules')) {
                            if (id.includes('@mui/icons-material')) {
                                return 'vendor_mui_icons';
                            }
                            if (
                                id.includes('@mui') ||
                                id.includes('@emotion')
                            ) {
                                return 'vendor_mui_core';
                            }
                            if (id.includes('recharts')) {
                                return 'vendor_recharts';
                            }
                            if (
                                id.includes('/node_modules/react/') ||
                                id.includes('/node_modules/react-dom/') ||
                                id.includes('/node_modules/react-router/') ||
                                id.includes('/node_modules/react-router-dom/')
                            ) {
                                return 'vendor_react';
                            }
                        }
                    },
                },
                // Tree-shaking optimizations
                treeshake: {
                    moduleSideEffects: false,
                    propertyReadSideEffects: false,
                },
            },
        },
        // Optimize dependencies
        optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom'],
        },
        server: {
            open: true,
            port: 3000,
        },
        test: {
            pool: 'threads',
            globals: true,
            environment: 'happy-dom',
            setupFiles: './src/setupTests.ts',
            include: ['src/**/*.test.{js,jsx,ts,tsx}'],
            exclude: ['node_modules'],
            css: false,
            fileParallelism: true,
            isolate: true,
            maxWorkers: process.env['CI'] ? '100%' : '80%',
            threads: {
                useAtomics: true,
            },
            sequence: {
                hooks: 'list',
            },
            coverage: {
                provider: 'v8',
                reporter: ['text', 'lcov', 'html'],
                thresholds: {
                    statements: 86,
                    branches: 73,
                    functions: 88,
                    lines: 88,
                },
                exclude: [
                    'src/index.tsx',
                    'src/setupTests.ts',
                    'src/**/*.test.{js,jsx,ts,tsx}',
                    'src/**/*.d.ts',
                    'config/**',
                    'build/**',
                    'coverage/**',
                    '**/*.config.{js,ts,mjs}',
                ],
            },
        },
    };
});
