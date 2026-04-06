import pool from '../db.js';

const getAll = async () => {
  const res = await pool.query('SELECT * FROM morosos ORDER BY id DESC');
  return res.rows;
};

const create = async (data) => {
  const { rut, nombre, monto_adeudado, condominio, ciudad, meses_mora, corredor_responsable } = data;
  const res = await pool.query(
    `INSERT INTO morosos 
      (rut, nombre, monto_adeudado, condominio, ciudad, meses_mora, corredor_responsable) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [rut, nombre, monto_adeudado, condominio, ciudad, meses_mora, corredor_responsable]
  );
  return res.rows[0];
};

const update = async (id, data) => {
  const { rut, nombre, monto_adeudado, condominio, ciudad, meses_mora, corredor_responsable } = data;
  const res = await pool.query(
    `UPDATE morosos 
     SET rut=$1, nombre=$2, monto_adeudado=$3, condominio=$4, ciudad=$5, meses_mora=$6, corredor_responsable=$7 
     WHERE id=$8 
     RETURNING *`,
    [rut, nombre, monto_adeudado, condominio, ciudad, meses_mora, corredor_responsable, id]
  );
  return res.rows[0];
};

const remove = async (id) => {
  await pool.query('DELETE FROM morosos WHERE id=$1', [id]);
};

export const morosoModel = {
  getAll,
  create,
  update,
  remove
};