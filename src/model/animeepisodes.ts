import { InferSchemaType, model } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const animeEpisodesSchema = new Schema({
  coverImage: { type: String },
  episodeName: { type: String },
  totalTime: { type: Number },
  publicTime: { type: Date },
  // *
  content: { type: String },
  comments: { type: Array },
  likes: { type: Array }, // list of user liked
  views: { type: Number },
  advertisement: { type: mongoose.Types.ObjectId },
});

type AnimeEpisodes = InferSchemaType<typeof animeEpisodesSchema>;

export default mongoose.models.AnimeEpisodes ||
  mongoose.model<AnimeEpisodes>("AnimeEpisodes", animeEpisodesSchema);
