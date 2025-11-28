import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/entities';

// SOLUCIÓN: Usamos Omit<IUser, '_id'> para evitar el conflicto de tipos
// Esto le dice a TS: "Usa todo lo de IUser MENOS el _id, ese déjaselo a Mongoose"
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  nombreCompleto: { type: String, required: true },
  dni: { type: String, required: true, unique: true, trim: true },
  telefono: { type: String, required: true },
  // NUEVO CAMPO: ROL
  role: { 
    type: String, 
    default: 'USER', 
    enum: ['USER', 'ADMIN'] 
  },
  statusSolicitud: { 
    type: String, 
    default: 'PENDIENTE', 
    enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'] 
  },

  datosPersonales: {
    dependencia: { type: String, required: true },
    cargo: { type: String, required: true },
    fechaIngreso: { type: Date, required: true },
    condicionLaboral: { 
      type: String, 
      required: true,
      enum: ['DOCENTE', 'ADMINISTRATIVO', 'CAS', 'ESTUDIANTE', 'OTRO']
    }
  },

  vehiculo: {
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    placa: { type: String, required: true, unique: true, uppercase: true, trim: true },
    color: { type: String, required: true }
  },

  documentos: {
    dniUrl: { type: String, required: true },
    licenciaUrl: { type: String, required: true }
  },

  autorizacion: {
    fechaAprobacion: { type: Date },
    comentario: String
  }
}, {
  timestamps: true // Esto crea automáticamente createdAt y updatedAt
});

export default mongoose.model<IUserDocument>('User', UserSchema);