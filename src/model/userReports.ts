import { InferSchemaType, model, mongo } from "mongoose";
import mongoose from "mongoose";

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const userReportsSchema = new Schema({
  reportContent: { type: String },
  reportTime: { type: Date },
  userBeReportedId: { type: mongoose.Types.ObjectId },
  userReportedId: { type: mongoose.Types.ObjectId },
  type: { type: String },
  destinationId: { type: mongoose.Types.ObjectId },
  commentId: { type: mongoose.Types.ObjectId },
  status: { type: String },
});

type UserReports = InferSchemaType<typeof userReportsSchema>;

export default mongoose.models.UserReports ||
  mongoose.model<UserReports>("UserReports", userReportsSchema);
