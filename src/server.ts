import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db';
import historyRoutes from './routes/historyRoutes';
import { initMQTT } from './services/mqttService';

// Importar rutas
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes'; // <--- AGREGAR
// Configuración inicial
dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Conectar BD
connectDB();
initMQTT();

// Middlewares
app.use(cors()); 
app.use(helmet());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // <--- AGREGAR ESTA LÍNEA
// Ruta base
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 UNSAPark API v1.0 funcionando correctamente');
});
app.use('/api/history', historyRoutes);

// Iniciar
app.listen(PORT, () => {
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
});