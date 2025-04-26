import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const animesSchema = new Schema({
  coverImage: { type: String },
  landspaceImage: { type: String },
  movieName: { type: String },
  genres: { type: Array },
  publishTime: { type: String },
  ageFor: { type: String },
  publisher: { type: String },
  description: { type: String },
  episodes: { type: Array },
});

type Animes = InferSchemaType<typeof animesSchema>;
// module.exports =
//   mongoose.models.Animes || mongoose.model("Animes", animesSchema);

export default mongoose.models.Animes ||
  mongoose.model<Animes>("Animes", animesSchema);
// export default model<Animes>("Animes", animesSchema);
