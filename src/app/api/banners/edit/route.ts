import BannerModel from "@/model/banners";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";


export async function POST(req: Request) {
    await connectMongoDB();
    const body = await req.json();
    const idList: mongoose.Types.ObjectId[] = [];
    body.list.map((item) => {
        idList.push(new mongoose.Types.ObjectId(item));
    });
    const banner = await BannerModel.findById(body._id);
    banner.list = idList;
    banner.save();
    if (banner) {
        return new Response(JSON.stringify(banner), { status: 200 });
    }
}