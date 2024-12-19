import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global test functions like `test`, `expect`
    environment: 'node', // Set test environment to Node.js
    coverage: {
      provider: 'v8', // Use V8 for coverage
      reporter: ['text', 'json', 'html'], // Coverage report formats
    },
  },
});
