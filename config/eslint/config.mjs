import config from 'eslint-config-holy-grail';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
    { extends: [config], languageOptions: { globals: { ...globals.node } }, rules: { 'no-sync': 'off', 'node/no-missing-require': 'off' } },
    {
        files: ['**/*.ts'],
        languageOptions: { parserOptions: { projectService: { allowDefaultProject: ['config/vitest/integration.ts'] } } },
        rules: { '@typescript-eslint/strict-boolean-expressions': 'off' }
    }
]);
