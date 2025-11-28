import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI || '';
    
    if (!uri) {
      console.error("❌ FATAL: MONGO_URI no está definida en .env");
      process.exit(1);
    }

    // Opciones adicionales no son necesarias en Mongoose 6+ (ya vienen por defecto)
    const conn = await mongoose.connect(uri);
    
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${(error as Error).message}`);
    // Detener la app si no hay base de datos (es crítico)
    process.exit(1);
  }
};

export default connectDB;