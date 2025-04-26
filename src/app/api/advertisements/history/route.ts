import AdvertisementPortalHistory from "@/model/advertisementsportalhistories";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        const url = new URL(request.url);
        const searchParams = new URLSearchParams(url.search);
        const id = searchParams?.get("id");

        const history = await AdvertisementPortalHistory.find({ userId: id });

        return new Response(JSON.stringify(history), { status: 200 });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}