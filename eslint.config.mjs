import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/*.md',
    '.github/',
    'dist/',
    'node_modules/',
    '*.d.ts',
  ],
})
