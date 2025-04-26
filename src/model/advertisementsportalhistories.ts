import mongoose from "mongoose";

const advertisementsPortalHistoriesSchema = new mongoose.Schema({
    userId: { type: String },
    orderDate: { type: Date },
    paymentMethod: { type: String },
    status: { type: String },
    price: { type: Number },
    videoUrl: { type: String },
    linkUrl: { type: String },
    episodeList: { type: Array },
});

type AdvertisementPortalHistory = mongoose.InferSchemaType<typeof advertisementsPortalHistoriesSchema>;

export default mongoose.models.AdvertisementPortalHistory || mongoose.model<AdvertisementPortalHistory>("AdvertisementPortalHistory", advertisementsPortalHistoriesSchema);