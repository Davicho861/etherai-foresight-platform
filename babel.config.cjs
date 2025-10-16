/**
 * Configuración optimizada de Babel
 * - Soporte completo de ESM/CJS
 * - Transformaciones avanzadas
 * - Optimizaciones de rendimiento
 */
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
      modules: 'auto',
      useBuiltIns: 'usage',
      corejs: 3,
      debug: false
    }],
    ['@babel/preset-typescript', {
      allowDeclareFields: true,
      optimizeConstEnums: true
    }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-transform-modules-commonjs', {
      allowTopLevelThis: true,
      loose: true,
      strict: true
    }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ],
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        'babel-plugin-dynamic-import-node'
      ]
    }
  },
  assumptions: {
    setPublicClassFields: true,
    privateFieldsAsProperties: true,
    constantReexports: true
  },
  compact: true,
  sourceMaps: 'inline',
  ignore: ['node_modules'],
  only: [
    './src',
    './__tests__',
    './jest.setup.js',
    './jest.setup.backend.js'
  ]
};
