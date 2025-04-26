import connectMongoDB from "@/lib/mongodb";
import CredentialsModel from "@/model/credentials";

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const { loginid } = await request.json();
    const credential = await CredentialsModel.findOne({ loginid }).select(
      "_id"
    );
    console.log("loginid: ", credential);

    return new Response(JSON.stringify({ credential }));
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
