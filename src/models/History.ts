import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  placa: string;
  puerta: string;
  fechaEntrada: Date;
  fechaSalida?: Date;
}

const HistorySchema: Schema = new Schema({
  placa: { type: String, required: true, index: true }, 
  puerta: { type: String, required: true },
  fechaEntrada: { type: Date, default: Date.now },
  fechaSalida: { type: Date }
});

export default mongoose.model<IHistory>('History', HistorySchema);