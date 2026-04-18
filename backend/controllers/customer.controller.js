const {
  createCustomerRecord,
  getCustomerRecords,
  getCustomerRecordById,
  updateCustomerRecord,
  deleteCustomerRecord,
} = require('../services/customer.service');

async function createCustomer(req, res) {
  const customer = await createCustomerRecord(req.body);
  res.status(201).json(customer);
}

async function getCustomers(req, res) {
  const customers = await getCustomerRecords(req.query);
  res.json(customers);
}

async function getCustomerById(req, res) {
  const customer = await getCustomerRecordById(req.params.id);
  res.json(customer);
}

async function updateCustomer(req, res) {
  const customer = await updateCustomerRecord(req.params.id, req.body);
  res.json(customer);
}

async function deleteCustomer(req, res) {
  await deleteCustomerRecord(req.params.id);
  res.status(204).end();
}

module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };
