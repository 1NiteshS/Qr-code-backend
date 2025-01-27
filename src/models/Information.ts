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

const InformationSchema: Schema = new Schema(
    {
        id: { 
            type: String, 
            required: true, 
            unique: true,
        },
        name: { type: String, required: true },
        position: { type: String, required: true },
        organization: { type: String, required: true },
        country: { type: String, required: true },
        email: { type: String, required: true },
        phoneNo: { type: String, required: true },
    },
    { timestamps: true } // Adds `createdAt` and `updatedAt`
);

export default mongoose.model<IInformation>('Information', InformationSchema);