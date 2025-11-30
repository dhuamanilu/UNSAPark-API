import { Router } from 'express';
import History from '../models/History';

const router = Router();

/**
 * Último registro del vehículo
 * GET /api/history/latest/:placa
 */
router.get('/latest/:placa', async (req, res) => {
  try {
    const { placa } = req.params;
    
    const ultimo = await History.findOne({ placa })
      .sort({ fechaEntrada: -1 })
      .lean();

    if (!ultimo) {
      return res.json({ estacionado: false, msg: "No hay historial" });
    }

    const estacionado = ultimo.fechaEntrada && !ultimo.fechaSalida;

    return res.json({
      estacionado,
      puerta: ultimo.puerta || "Desconocida",
      fechaEntrada: ultimo.fechaEntrada,
      fechaSalida: ultimo.fechaSalida
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error en servidor" });
  }
});

router.get('/vehicle/:placa', async (req, res) => {
  try {
    const { placa } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const historial = await History.find({ placa })
      .sort({ fechaEntrada: -1 }) // Primero los más recientes
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await History.countDocuments({ placa });

    res.json({
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: historial
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error en servidor" });
  }
});

export default router;
