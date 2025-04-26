import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const animeAlbumSchema = new Schema({
  albumName: { type: String },
  animeList: { type: Array },
});

type AnimeAlbum = InferSchemaType<typeof animeAlbumSchema>;

export default mongoose.models.AnimeAlbum ||
  mongoose.model<AnimeAlbum>("AnimeAlbum", animeAlbumSchema);
