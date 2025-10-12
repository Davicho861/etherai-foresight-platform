// Re-export root babel config so tests executed from server can find it
module.exports = require('../babel.config.cjs');
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
