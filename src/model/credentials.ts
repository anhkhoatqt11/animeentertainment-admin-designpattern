import mongoose, { InferSchemaType, model, Schema } from "mongoose";


const credentialSchema = new Schema({
    username: { type: String },
    loginid: { type: String },
    password: { type: String },
    role: { type: String },
    status: { type: String },
}, { timestamps: true })

type Credential = InferSchemaType<typeof credentialSchema>;

export default mongoose.models.Credential || model<Credential>("Credential", credentialSchema);