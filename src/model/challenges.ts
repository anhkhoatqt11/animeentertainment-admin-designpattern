import { InferSchemaType, model, Schema } from "mongoose";
import mongoose from "mongoose";

const challengesSchema = new Schema({
  challengeName: { type: String },
  endTime: { type: Date },
  questionCollection: { type: Array },
});

type Challenges = InferSchemaType<typeof challengesSchema>;

export default mongoose.models.Challenges ||
  model<Challenges>("Challenges", challengesSchema);
