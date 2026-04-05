const model = require('../models/morosoModel');

const getMorosos = async (req, res) => {
  const data = await model.getAll();
  res.json(data);
};

const createMoroso = async (req, res) => {
  const newData = await model.create(req.body);
  res.json(newData);
};

const updateMoroso = async (req, res) => {
  const updated = await model.update(req.params.id, req.body);
  res.json(updated);
};

const deleteMoroso = async (req, res) => {
  await model.remove(req.params.id);
  res.json({ message: 'Eliminado' });
};

module.exports = {
  getMorosos,
  createMoroso,
  updateMoroso,
  deleteMoroso
};