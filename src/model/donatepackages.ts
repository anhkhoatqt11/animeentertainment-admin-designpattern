import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const donatepackagesSchema = new mongoose.Schema({
    coverImage: { type: String },
    title: { type: String },
    subTitle: { type: String },
    donateRecords: { type: Array },
    coin: { type: Number },
});

type Donatepackages = InferSchemaType<typeof donatepackagesSchema>;

export default mongoose.models.Donatepackages || mongoose.model<Donatepackages>("Donatepackages", donatepackagesSchema);