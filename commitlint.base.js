export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0], // Disable body max line length
    'subject-case': [0, 'always'], // Disable subject case check (allow English titles)
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
  },
};