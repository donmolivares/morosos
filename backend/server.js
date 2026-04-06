const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/morosos', require('./routes/morosoRoutes'));

app.get('/', (req, res) => {
  res.send('Backend funcionando ✅');
});

app.head('/', (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});