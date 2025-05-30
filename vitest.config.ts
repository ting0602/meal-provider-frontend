// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),      // ← pick up your tsconfig “paths”
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.tsx',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: { reporter: ['text', 'lcov'] },
  },
  resolve: {
    alias: {
      // (Optional override or addition)
      // 'provider': '/src/provider',
      // 'authentication': '/src/authentication',
    }
  }
})
