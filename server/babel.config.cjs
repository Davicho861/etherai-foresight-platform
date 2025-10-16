// ARES FORGED: Perfect Babel configuration for ESM/TS backend
// Destroyed and reforged in divine fire - pure, modern, immutable
module.exports = function (api) {
  api.cache(true);

  return {
    // Presets: Modern JavaScript/TypeScript perfection
    presets: [
      ['@babel/preset-env', {
        targets: { node: 'current' },
        modules: 'auto' // Let Babel decide based on environment
      }],
      ['@babel/preset-typescript', {
        allowNamespaces: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true
      }]
    ],

    // Plugins: Essential modern features
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-export-namespace-from'
    ],

    // Source Type: Automatic detection for ESM/CJS interop
    sourceType: 'unambiguous'
  };
};
