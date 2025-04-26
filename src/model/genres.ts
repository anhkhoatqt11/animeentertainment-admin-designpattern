import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const genresSchema = new Schema({
  genreName: { type: String },
});

type Genres = InferSchemaType<typeof genresSchema>;

export default mongoose.models.Genres ||
  mongoose.model<Genres>("Genres", genresSchema);
