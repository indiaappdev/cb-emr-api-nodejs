const invoiceRoutes = require('./invoice_routes');
const prescriptionRoutes = require('./prescription_routes')

// Mount Routes
exports.mountRoutes = (app) => {
  app.use('/', invoiceRoutes);
  app.use('/prescription', prescriptionRoutes);
};
