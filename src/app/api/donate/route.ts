import DonatePackage from "@/model/donatepackages";
import connectMongoDB from "@/lib/mongodb";


export async function GET(request: Request) {
    await connectMongoDB();
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const page = parseInt(searchParams?.get("page")); // Retrieves the value of the 'skip' parameter
    const limit = parseInt(searchParams?.get("limit")); // Retrieves the value of the 'limit' parameter
    const searchWord = searchParams.get("name");
    const donates = await DonatePackage.aggregate([
        {
            $addFields: {
                result: {
                    $regexMatch: {
                        input: "$title",
                        regex: searchWord,
                        options: "i",
                    },
                },
            },
        },
        { $match: { result: true } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ]);

    const countItem = await DonatePackage.aggregate([
        {
            $addFields: {
                result: {
                    $regexMatch: {
                        input: "$title",
                        regex: searchWord,
                        options: "i",
                    },
                },
            },
        },
        { $match: { result: true } },
    ]);

    const data = {
        data: donates,
        totalPages: Math.ceil(countItem.length / limit),
        totalItems: donates.length,
    };

    return new Response(JSON.stringify(data), { status: 200 });
}