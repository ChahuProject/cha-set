import base from './commitlint.base.js';

export default {
  ...base,
  rules: {
    ...base.rules,
    // Extend project-specific scope allowlist here (e.g. ['core', 'cli', 'app'])
    // This file is protected by update_ignore and will not be overwritten on template updates
  },
};