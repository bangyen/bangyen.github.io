/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
    const plugins = [
        react(),
        tsconfigPaths(),
        viteCompression(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.ico',
                'robots.txt',
                'apple-touch-icon.webp',
            ],
            manifest: {
                name: 'Bangyen Pham - Portfolio',
                short_name: 'Bangyen',
                description:
                    'Portfolio of Bangyen Pham - Backend Developer and AI/ML Engineer',
                theme_color: '#0a0a0a',
                background_color: '#0a0a0a',
                display: 'standalone',
                icons: [
                    {
                        src: 'favicon.ico',
                        sizes: '64x64 32x32 24x24 16x16',
                        type: 'image/x-icon',
                    },
                    {
                        src: 'logo192.webp',
                        sizes: '192x192',
                        type: 'image/webp',
                    },
                    {
                        src: 'logo512.webp',
                        sizes: '512x512',
                        type: 'image/webp',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,gz,json}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // <1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
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
            // Minification options
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true, // Remove console.logs in production
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
                },
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
                            if (id.includes('katex')) {
                                return 'vendor_math';
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
            poolOptions: {
                threads: {
                    useAtomics: true,
                },
            },
            sequence: {
                hooks: 'list',
            },
            coverage: {
                provider: 'v8',
                reporter: ['text', 'lcov', 'html'],
                thresholds: {
                    statements: 90,
                    branches: 80,
                    functions: 90,
                    lines: 90,
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
