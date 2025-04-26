import DonatePackage from "@/model/donatepackages";
import Users from "@/model/users";
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
    try {
        await connectMongoDB();
        const url = new URL(request.url);
        const searchParams = new URLSearchParams(url.search);
        const id = searchParams?.get("id");

        if (!id) {
            return new Response("ID parameter is required", { status: 400 });
        }

        const donatepackage = await DonatePackage.findById(id);

        if (!donatepackage) {
            return new Response("DonatePackage not found", { status: 404 });
        }

        const donateRecords = donatepackage.donateRecords;

        // Aggregate donations by userId
        const donorMap = new Map();

        donateRecords.forEach(record => {
            if (donorMap.has(record.userId)) {
                donorMap.get(record.userId).coinPoints += donatepackage.coin;
                donorMap.get(record.userId).donateCount += 1;
            } else {
                donorMap.set(record.userId, {
                    userId: record.userId,
                    coinPoints: donatepackage.coin,
                    donateCount: 1
                });
            }
        });

        // Convert the Map to an array
        const donorArray = Array.from(donorMap.values());

        // Get user details for each donor
        const userIds = donorArray.map(donor => donor.userId);
        const users = await Users.find({ _id: { $in: userIds } }, 'username avatar');

        // Create a map of userId to user details
        const userMap = new Map();
        users.forEach(user => {
            userMap.set(user._id.toString(), {
                username: user.username,
                avatar: user.avatar
            });
        });

        // Merge user details with donor details
        const donors = donorArray.map(donor => ({
            ...donor,
            username: userMap.get(donor.userId)?.username || null,
            avatar: userMap.get(donor.userId)?.avatar || null
        }));

        return new Response(JSON.stringify(donors), { status: 200 });

    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}
