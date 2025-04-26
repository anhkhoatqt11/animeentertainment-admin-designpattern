import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const bannersSchema = new Schema({
    type: {type: String},
    list: {type: Array},
})

type Banners = InferSchemaType<typeof bannersSchema>;

export default mongoose.models.Banners ||
  mongoose.model<Banners>("Banners", bannersSchema);