import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  { ignores: ['dist', '.astro', 'docs', 'node_modules', 'screenshots'] },
  { languageOptions: { globals: { process: 'readonly' } } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
];
