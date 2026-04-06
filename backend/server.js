import cors from "cors";
import "dotenv/config";
import express from "express";
import morosoRoutes from "./routes/morosoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/morosos', morosoRoutes);
app.get('/', (req, res) => {
  res.send('Backend funcionando ✅');
});

app.head('/', (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//dfdggdfgdf