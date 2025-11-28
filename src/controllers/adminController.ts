import { Request, Response } from 'express';
import User from '../models/User';

// 1. Obtener solicitudes pendientes
export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    // Buscamos usuarios que sean USER y estén PENDIENTES
    const requests = await User.find({ 
      role: 'USER', 
      statusSolicitud: 'PENDIENTE' 
    }).sort({ createdAt: -1 }); // Los más recientes primero

    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener solicitudes' });
  }
};

// 2. Aprobar o Rechazar solicitud
export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comentario } = req.body; // 'APROBADO' o 'RECHAZADO'

    if (!['APROBADO', 'RECHAZADO'].includes(status)) {
      return res.status(400).json({ msg: 'Estado inválido' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        statusSolicitud: status,
        autorizacion: {
          fechaAprobacion: new Date(),
          comentario: comentario || ''
        }
      },
      { new: true } // Devuelve el objeto actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Solicitud no encontrada' });
    }

    res.json({ success: true, msg: `Solicitud ${status.toLowerCase()} exitosamente.` });

  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar solicitud' });
  }
};