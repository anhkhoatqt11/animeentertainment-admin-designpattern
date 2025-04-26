import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const comicAlbumSchema = new Schema({
  albumName: { type: String },
  comicList: { type: Array },
});

type ComicAlbum = InferSchemaType<typeof comicAlbumSchema>;

export default mongoose.models.ComicAlbum ||
  mongoose.model<ComicAlbum>("ComicAlbum", comicAlbumSchema);
