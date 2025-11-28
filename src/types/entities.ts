// Tipos auxiliares
export type CondicionLaboral = 'DOCENTE' | 'ADMINISTRATIVO' | 'CAS' | 'ESTUDIANTE' | 'OTRO';
export type StatusSolicitud = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
export type PuertaStatus = "OPEN" | "CLOSED" | "MAINTENANCE";
export type AreaStatus = "OPEN" | "CLOSED" | "FULL" | "EVENT";
export type UserRole = 'USER' | 'ADMIN'; // <--- Nuevo Tipo

// --- INTERFAZ DEL USUARIO (La que faltaba) ---
export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  nombreCompleto: string;
  dni: string;
  telefono: string;
  role: UserRole;
  datosPersonales: {
    dependencia: string;
    cargo: string;
    fechaIngreso: Date;
    condicionLaboral: CondicionLaboral;
  };

  vehiculo: {
    marca: string;
    modelo: string;
    placa: string;
    color: string;
  };

  documentos: {
    dniUrl: string;
    licenciaUrl: string;
  };

  statusSolicitud: StatusSolicitud;
  
  autorizacion?: {
    fechaAprobacion: Date;
    comentario?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

// --- OTRAS INTERFACES (Para compatibilidad) ---
export interface Puerta {
  id: string;
  nombre: string;
  status: PuertaStatus;
  latitude: number;
  longitude: number;
  cuposTotales: number;  
  cuposOcupados: number; 
}

export interface Area {
  id: string;
  nombre: string;
  status: AreaStatus;
  mensaje: string; 
  puertas: Puerta[];
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface ParkingStatusResponse {
  areas: Area[];
}

export interface HistoryItem {
  id: string;
  area: string;
  puerta: string;
  placa: string;
  fechaEntrada: string;
  fechaSalida: string | null;
}

export interface Vehiculo {
  placa: string;
  modelo: string;
  marca?: string;
  color?: string;
}

export interface UserProfile {
  id: string;
  nombreCompleto: string;
  email: string;
  dni: string;
  tipoUsuario: string;
  codigo: string;
  escuela: string;
  vehiculos: Vehiculo[];
}