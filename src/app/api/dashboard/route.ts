import prisma from "@/lib/prisma";
import ComicsModel from "../../../model/comics";
import AnimeEpisode from "@/model/animeepisodes";
import AdvertisementPortalHistory from "@/model/advertisementsportalhistories";
import PaymentHistory from "@/model/paymenthistories";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
    await connectMongoDB();
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const comicCount = await ComicsModel.countDocuments();
    const animeCount = await AnimeEpisode.countDocuments();

    const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            start: new Date(date.getFullYear(), date.getMonth(), 1),
            end: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        };
    }).reverse();

    const adsRevenue = await Promise.all(
        last12Months.map(async ({ start, end }) => {
            const result = await AdvertisementPortalHistory.aggregate([
                {
                    $match: {
                        orderDate: { $gte: start, $lte: end },
                        paymentMethod: { $in: ["ZaloPay", "VNPay"] },
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                }
            ]);
            return result.length > 0 ? result[0].total : 0;
        })
    );

    const revenue = await Promise.all(
        last12Months.map(async ({ start, end }) => {
            const result = await PaymentHistory.aggregate([
                {
                    $match: {
                        orderDate: { $gte: start, $lte: end },
                        paymentMethod: { $in: ["ZaloPay", "VNPay"] },
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$price" }
                    }
                }
            ]);
            return result.length > 0 ? result[0].total : 0;
        })
    );

    const adsRevenuePreviousMonth = adsRevenue[10];
    const adsRevenueCurrentMonth = adsRevenue[11];
    const revenuePreviousMonth = revenue[10];
    const revenueCurrentMonth = revenue[11];

    const adsRevenueGrowth = adsRevenuePreviousMonth === 0
        ? (adsRevenueCurrentMonth > 0 ? 100 : 0)
        : ((adsRevenueCurrentMonth - adsRevenuePreviousMonth) / adsRevenuePreviousMonth) * 100;

    const revenueGrowth = revenuePreviousMonth === 0
        ? (revenueCurrentMonth > 0 ? 100 : 0)
        : ((revenueCurrentMonth - revenuePreviousMonth) / revenuePreviousMonth) * 100;

    const data = {
        comicCount,
        animeCount,
        adsRevenue,
        revenue,
        adsRevenueCurrentMonth,
        adsRevenueGrowth: adsRevenueGrowth.toFixed(2),
        revenueCurrentMonth,
        revenueGrowth: revenueGrowth.toFixed(2),
    };

    return new Response(JSON.stringify(data), { status: 200 });
}