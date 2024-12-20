const invoiceRoutes = require('./invoice_routes');

// Mount Routes
exports.mountRoutes = (app) => {
  app.use('/', invoiceRoutes);
};
