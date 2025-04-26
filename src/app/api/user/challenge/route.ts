import UserModel from '@/model/users';
import connectMongoDB from "@/lib/mongodb";

export async function GET(request: Request) {
    try {
        // Connect to MongoDB
        await connectMongoDB();
        // Fetch all users
        const users = await UserModel.find({});

        // If no users found
        if (!users || users.length === 0) {
            return new Response(JSON.stringify({ message: 'No users found' }), { status: 404 });
        }

        // Extract required user details
        const userData = users.map(user => ({
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            challenges: user.challenges,
        }));

        return new Response(JSON.stringify(userData), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}