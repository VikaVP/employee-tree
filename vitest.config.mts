/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true, // This is needed by @testing-library to be cleaned up after each test
    include: ['tests/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      include: ['tests/**/*'],
      exclude: ['tests/**/*.spec.{js,jsx,ts,tsx}', '**/*.d.ts'],
      reporter: ['html'],
    },
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'],
      ['tests/hooks/**/*.test.ts', 'jsdom'],
    ],
    setupFiles: ['./vitest-setup.ts'],
    env: loadEnv('', process.cwd(), ''),
  },
});
