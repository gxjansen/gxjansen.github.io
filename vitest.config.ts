import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { getViteConfig } from 'astro/config';

const testConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80
      }
    },
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@js': fileURLToPath(new URL('./src/js', import.meta.url)),
      '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
    }
  }
};

export default defineConfig(async () => {
  const viteConfig = await getViteConfig({});
  
  return {
    ...viteConfig,
    ...testConfig,
    test: {
      ...testConfig.test,
      ...viteConfig.test
    }
  };
});
