/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue';
import { execSync } from 'child_process';
import path from 'path';
import { defineConfig } from 'vite';

const source_directory = path.resolve(__dirname, 'src');
const test_directory = path.resolve(__dirname, 'tests');
const test_output_directory = path.resolve(test_directory, 'output');
const config_directory = path.resolve(__dirname, 'config');

// Release Info
const VERSION = process.env.npm_package_version;
const COMMIT_HASH = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
const REPOSITORY = execSync('git ls-remote --get-url', { encoding: 'utf-8' }).trim();

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': source_directory,
      '~': test_directory,
      config: config_directory,
    },
  },
  test: {
    globals: true,
    reporters: ['default', 'junit'],
    outputFile: path.resolve(test_output_directory, 'junit.xml'),
    mockReset: true,
    environment: 'jsdom',
    coverage: {
      all: true,
      src: [source_directory],
      include: [
        'src/actions/**',
        'src/components/**',
        'src/composables/**',
        'src/directives/**',
        'src/router/**',
        'src/services/**',
        'src/stores/**',
        'src/utils/**',
        'src/valdiation/**',
        'src/views/**',
        'src/types/uint-256.ts',
        'src/types/token-amount.ts',
        '!**/types.ts',
      ],
    },
  },
  define: {
    APP_RELEASE: {
      VERSION,
      COMMIT_HASH,
      REPOSITORY,
    },
  },
});
