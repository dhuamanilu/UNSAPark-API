import mqtt from 'mqtt';
import User from '../models/User';
import History from '../models/History';

const BROKER_URL = 'mqtt://test.mosquitto.org'; 
const TOPIC_ENTRADA = 'unsapark/+/entrada'; 
const TOPIC_SALIDA = 'unsapark/+/salida';

export const initMQTT = () => {
  const client = mqtt.connect(BROKER_URL);

  client.on('connect', () => {
    console.log('📡 Conectado al Broker MQTT');
    client.subscribe([TOPIC_ENTRADA, TOPIC_SALIDA], (err) => {
      if (!err) console.log(`👂 Escuchando en ${TOPIC_ENTRADA} y ${TOPIC_SALIDA}`);
    });
  });

  client.on('message', async (topic, message) => {
    const msgString = message.toString();
    console.log(`📨 Mensaje recibido en [${topic}]: ${msgString}`);

    try {
      const data = JSON.parse(msgString);
      const placa = data.placa;
      
      const partesTopic = topic.split('/');
      const puerta = partesTopic[1]; 
      const accion = partesTopic[2];

      if (accion === 'entrada') {
        await handleEntrada(placa, puerta);
      } else if (accion === 'salida') {
        await handleSalida(placa, puerta);
      }

    } catch (error) {
      console.error("❌ Error procesando mensaje MQTT:", error);
    }
  });
};

async function handleEntrada(placa: string, puerta: string) {
  const user = await User.findOne({ 'vehiculo.placa': placa, statusSolicitud: 'APROBADO' });
  
  if (!user) {
    console.log(`⛔ Acceso DENEGADO para ${placa}: No registrado o no aprobado.`);
    return;
  }

  const yaEstaAdentro = await History.findOne({ 
    placa: placa, 
    fechaSalida: { $exists: false } 
  });

  if (yaEstaAdentro) {
    console.log(`⚠️ ALERTA: El vehículo ${placa} intenta entrar, pero YA figura dentro del campus.`);
    return; 
  }

  const nuevoIngreso = new History({
    placa: placa,
    puerta: puerta,
    fechaEntrada: new Date()
  });

  await nuevoIngreso.save();
  console.log(`✅ Ingreso registrado: ${placa} por ${puerta}`);
}

async function handleSalida(placa: string, puerta: string) {
  const registroAbierto = await History.findOne({ placa: placa, fechaSalida: { $exists: false } }).sort({ fechaEntrada: -1 });

  if (registroAbierto) {
    registroAbierto.fechaSalida = new Date();
    await registroAbierto.save();
    console.log(`👋 Salida registrada: ${placa} por ${puerta}`);
  } else {
    console.log(`⚠️ Error: El vehículo ${placa} intentó salir pero no tenía registro de entrada.`);
  }
}