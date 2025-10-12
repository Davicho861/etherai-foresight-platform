const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// El Servidor del Oráculo: Configuración centralizada del Mock Service Worker
// Este servidor intercepta todas las llamadas de red durante las pruebas,
// asegurando que ninguna solicitud real llegue a internet.
const server = setupServer(...handlers);

module.exports = { server };