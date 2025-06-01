// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

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
    alias: [
      { find: 'hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: 'api', replacement: path.resolve(__dirname, 'src/api') },
      { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
      { find: 'provider', replacement: path.resolve(__dirname, 'src/provider') },
      { find: 'authentication', replacement: path.resolve(__dirname, 'src/authentication') },
    ],
  }
})
