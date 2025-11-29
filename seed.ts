import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seeds = async () => {
  console.log("🌱 Iniciando sembrado de datos...");
  
  await mongoose.connect(process.env.MONGO_URI || '');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('123456', salt);

  const usuarios = [];

  for (let i = 0; i < 50; i++) {
    const placaRandom = `ABC-${100 + i}`;
    
    usuarios.push({
      email: `user${i}@unsa.edu.pe`,
      password: passwordHash,
      nombreCompleto: `Usuario Simulado ${i}`,
      dni: `DNI${100000+i}`,
      telefono: "900000000",
      role: 'USER',
      statusSolicitud: 'APROBADO', 
      datosPersonales: {
        dependencia: "Ingeniería",
        cargo: "Estudiante",
        fechaIngreso: new Date(),
        condicionLaboral: "ESTUDIANTE"
      },
      vehiculo: {
        marca: "Toyota",
        modelo: "Yaris",
        placa: placaRandom,
        color: "Negro"
      },
      documentos: {
        dniUrl: "http://img.com/dni",
        licenciaUrl: "http://img.com/licencia"
      }
    });
  }

  try {
    await User.insertMany(usuarios);
    console.log("✅ 50 Usuarios insertados correctamente.");
  } catch (error) {
    console.error("❌ Error insertando:", error);
  } finally {
    mongoose.disconnect();
  }
};

seeds();