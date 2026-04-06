import { morosoModel } from "../models/morosoModel.js";
const getMorosos = async (req, res) => {
  try {
    const data = await morosoModel.getAll();
    res.json(data);
  } catch (error) {
    console.error('getMorosos error:', error);
    res.status(500).json({ error: error.message });
  }
};

const createMoroso = async (req, res) => {
  try {
    const newData = await morosoModel.create(req.body);
    res.json(newData);
  } catch (error) {
    console.error('createMoroso error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateMoroso = async (req, res) => {
  try {
    const updated = await morosoModel.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('updateMoroso error:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMoroso = async (req, res) => {
  try {
    await morosoModel.remove(req.params.id);
    res.json({ message: 'Eliminado' });
  } catch (error) {
    console.error('deleteMoroso error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const morosoController = {
  getMorosos,
  createMoroso,
  updateMoroso,
  deleteMoroso
};