const {
  createCustomerRecord,
  getCustomerRecords,
  getCustomerRecordById,
  updateCustomerRecord,
  deleteCustomerRecord,
} = require('../services/customer.service');

module.exports = {
  createCustomer: async (req, res) => {
    try {
      const customer = await createCustomerRecord(req.body);
      res.status(201).json(customer);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getCustomers: async (req, res) => {
    try {
      const customers = await getCustomerRecords(req.query);
      res.json(customers);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  getCustomerById: async (req, res) => {
    try {
      const customer = await getCustomerRecordById(req.params.id);
      res.json(customer);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  updateCustomer: async (req, res) => {
    try {
      const customer = await updateCustomerRecord(req.params.id, req.body);
      res.json(customer);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  },
  deleteCustomer: async (req, res) => {
    try {
      await deleteCustomerRecord(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
};
