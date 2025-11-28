import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import User from '../models/User';
import { IUser } from '../types/entities';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      email, password, nombreCompleto, dni, telefono, 
      datosPersonales, vehiculo, documentos 
    }: IUser = req.body;

    // Validaciones básicas
    if (!email || !password || !dni || !vehiculo?.placa) {
      res.status(400).json({ msg: 'Faltan campos obligatorios' });
      return;
    }

    // Verificar duplicados
    const existingUser = await User.findOne({
      $or: [
        { email },
        { dni },
        { 'vehiculo.placa': vehiculo.placa }
      ]
    });

    if (existingUser) {
      res.status(400).json({ msg: 'El usuario, DNI o placa ya existen.' });
      return;
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      nombreCompleto,
      dni,
      telefono,
      datosPersonales,
      vehiculo,
      documentos,
      role: 'USER',            // <--- Siempre nace USER
      statusSolicitud: 'PENDIENTE'
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      msg: 'Solicitud enviada exitosamente.' 
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ msg: 'Error interno del servidor', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validar que vengan los datos
    if (!email || !password) {
      res.status(400).json({ msg: 'Por favor ingrese email y contraseña.' });
      return;
    }

    // 2. Buscar usuario por email
    // Usamos select('+password') si en el modelo pusimos select:false (opcional), 
    // pero por defecto mongoose lo trae.
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(400).json({ msg: 'Credenciales inválidas (Usuario no encontrado).' });
      return;
    }
    if (!user.password) {
      res.status(500).json({ msg: 'Error de datos de usuario' });
      return;
    }
    // 3. Comparar contraseña (La que envía el usuario VS la encriptada en BD)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ msg: 'Credenciales inválidas (Contraseña incorrecta).' });
      return;
    }

    // 4. Generar Token JWT (La "Llave digital")
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    // Firmar el token con la clave secreta del .env
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secreto_temporal', 
      { expiresIn: '7d' }, // El token dura 7 días
      (err, token) => {
        if (err) throw err;
        
        // 5. Responder con el Token y los datos del usuario
        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            nombre: user.nombreCompleto,
            email: user.email,
            role: user.role,
            status: user.statusSolicitud, // Importante para saber si está Aprobado
            vehiculo: user.vehiculo
          }
        });
      }
    );

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};