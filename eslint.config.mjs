import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/*.md',
    'dist/',
    'node_modules/',
    '*.d.ts',
  ],
})
