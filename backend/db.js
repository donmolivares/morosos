import pg from 'pg';
import 'dotenv/config';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const pool = new pg.Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  },
  allowExitOnIdle: true
});

// Test connection
pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Conectado a la base de datos:', res.rows[0]);
  })
  .catch(err => {
  console.error('❌ Error conectando a la base de datos:', err);
});

export default pool;