import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import vuelosRoutes from "./routes/vuelosRoutes.js";
import registroRoutes from "./routes/ingresoRoutes.js";
import pasajeroRoutes from "./routes/pasajeroRoutes.js";
import mysql2 from "mysql2";
import miconny from "express-myconnection";
import { PORT } from "./config/config.js"
import { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD } from "./config/config.js";


const app = express();

app.use(express.json());
dotenv.config();

const dboptions = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD
};

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(miconny(mysql2, dboptions, "single"));

app.use("/api/usuarios", registroRoutes);
app.use("/api/pasajeros", pasajeroRoutes);
app.use("/api/vuelos", vuelosRoutes);
app.use("/imagenes", express.static("imagenes"));

app.get("/vuelos", async (req, res) => {
  try {
    const vuelos = await db.obtenerVuelos();
    res.json(vuelos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando por los cambios en el puerto ${PORT}`);
});

app.use((req, res) => {
  res.status(404).json({ message: 'No se encontró la ruta esperada.' });
});