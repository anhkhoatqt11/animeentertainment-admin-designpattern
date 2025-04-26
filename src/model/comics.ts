import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const comicsSchema = new Schema({
  coverImage: { type: String },
  landspaceImage: { type: String },
  comicName: { type: String },
  author: { type: String },
  artist: { type: String },
  genres: { type: Array },
  ageFor: { type: String },
  publisher: { type: String },
  description: { type: String },
  newChapterTime: { type: String },
  chapterList: { type: Array },
});

type Comics = InferSchemaType<typeof comicsSchema>;

export default mongoose.models.Comics ||
  mongoose.model<Comics>("Comics", comicsSchema);
