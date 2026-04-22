const {
  createCustomerRecord,
  getCustomerRecords,
  getCustomerRecordById,
  updateCustomerRecord,
  deleteCustomerRecord,
} = require('../services/customer.service');

module.exports = {
  createCustomer: (req, res) => {
    createCustomerRecord(req.body, (err, customer) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.status(201).json(customer);
    });
  },
  getCustomers: (req, res) => {
    getCustomerRecords(req.query, (err, customers) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(customers);
    });
  },
  getCustomerById: (req, res) => {
    getCustomerRecordById(req.params.id, (err, customer) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(customer);
    });
  },
  updateCustomer: (req, res) => {
    updateCustomerRecord(req.params.id, req.body, (err, customer) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.json(customer);
    });
  },
  deleteCustomer: (req, res) => {
    deleteCustomerRecord(req.params.id, (err, result) => {
      if (err) {
        return res.status(err.status || 500).json({ message: err.message });
      }
      res.status(204).end();
    });
  }
};
