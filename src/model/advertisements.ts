import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const advertisementsSchema = new Schema({
  representative: { type: String },
  pricePerAd: { type: Number },
  adVideoUrl: { type: String },
  forwardLink: { type: String },
  amount: { type: Number },
});

type Advertisements = InferSchemaType<typeof advertisementsSchema>;

export default mongoose.models.Advertisements ||
  mongoose.model<Advertisements>("Advertisements", advertisementsSchema);
