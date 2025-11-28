import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User'; // Asegúrate de que la ruta sea correcta

dotenv.config();

const createAdmin = async () => {
  console.log("🚀 Iniciando creación de Administrador...");

  // 1. Conectar a la Base de Datos
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }

  // 2. Datos del Admin
  const email = 'admin@gmail.com';
  const passwordText = 'Admin123';
  
  // Encriptar contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordText, salt);

  const adminData = {
    email: email,
    password: hashedPassword,
    nombreCompleto: "ADMINISTRADOR PRINCIPAL",
    dni: "00000000",
    telefono: "999999999",
    role: "ADMIN",              // <--- AQUÍ ESTÁ LA CLAVE
    statusSolicitud: "APROBADO", // <--- YA ENTRA APROBADO
    
    // Datos de relleno obligatorios por el Schema
    datosPersonales: {
      dependencia: "Rectorado",
      cargo: "Administrador de Sistema",
      fechaIngreso: new Date(),
      condicionLaboral: "ADMINISTRATIVO"
    },
    vehiculo: {
      marca: "N/A",
      modelo: "N/A",
      placa: "ADMIN01", // Placa reservada
      color: "N/A"
    },
    documentos: {
      dniUrl: "https://via.placeholder.com/150",
      licenciaUrl: "https://via.placeholder.com/150"
    }
  };

  try {
    // 3. Verificar si ya existe
    const userExistente = await User.findOne({ email });

    if (userExistente) {
      console.log("⚠️ El usuario admin@gmail.com ya existe.");
      console.log("🔄 Actualizando permisos a ADMIN...");
      
      // Forzamos la actualización
      userExistente.role = 'ADMIN';
      userExistente.statusSolicitud = 'APROBADO';
      userExistente.password = hashedPassword; // Reseteamos la clave por si se olvidó
      await userExistente.save();
      
      console.log("✅ Permisos actualizados correctamente.");
    } else {
      // 4. Crear nuevo
      const newAdmin = new User(adminData);
      await newAdmin.save();
      console.log("✨ Usuario ADMIN creado exitosamente.");
    }

  } catch (error) {
    console.error("❌ Error creando admin:", error);
  } finally {
    // 5. Cerrar conexión
    await mongoose.disconnect();
    console.log("👋 Conexión cerrada.");
    process.exit(0);
  }
};

createAdmin();