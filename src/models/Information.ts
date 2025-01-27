import mongoose, { Schema, Document } from 'mongoose';

export interface IInformation extends Document {
    id: string;
    name: string;
    position: string;
    organization: string;
    country: string;
    email: string;
    phoneNo: string;
}

const InformationSchema: Schema = new Schema({
    id: { type: String },
    name: { type: String },
    position : { type: String },
    organization : { type: String },
    country : { type: String },
    email: { type: String},
    phoneNo: { type: String },
}, { timestamps: true });

export default mongoose.model<IInformation>('Information', InformationSchema);