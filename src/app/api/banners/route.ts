import BannerModel from "../../../model/banners"
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
    await connectMongoDB();
    const bannerList = await BannerModel.aggregate([
        {
            $lookup: {
                from: "animes",
                localField: "list",
                foreignField: "_id",
                as: "animesList"
            },
        },
        {
            $lookup: {
                from: "comics",
                localField: "list",
                foreignField: "_id",
                as: "comicsList"
            },
        },
        {
            $addFields: {
                combinedList: {
                    $concatArrays: ["$animesList", "$comicsList"]
                },
            }
        },
        {
            $addFields: {
                combinedList: {
                    $map: {
                        input: "$combinedList",
                        as: "item",
                        in: {
                            $mergeObjects: ["$$item", { type: "$type" }]
                        }
                    }
                }
            }
        },
        {
            $project: {
                "combinedList.comicName": 1,
                "combinedList.movieName": 1,
                "combinedList.coverImage": 1,
                "combinedList.landspaceImage": 1,
                "combinedList._id": 1,
                "combinedList.type": 1,
                bannerName: 1,
                bannerType: 1,
            }
        },
        {
            $project: {
                list: "$combinedList",
                bannerName: 1,
                bannerType: 1,
            }
        }
    ]);

    return new Response(JSON.stringify(bannerList), { status: 200 });
}