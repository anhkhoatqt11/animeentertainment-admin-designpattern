import connectMongoDB from "@/lib/mongodb";
import CredentialsModel from "@/model/credentials";

export async function POST(request: Request) {
  try {
    const { status, role, username, id } = await request.json();
    await connectMongoDB();

    if (status != "") {
      await CredentialsModel.updateOne({ _id: id }, { status: status });
    }

    if (role != "") {
      await CredentialsModel.updateOne({ _id: id }, { role: role });
    }

    if (username != "") {
      await CredentialsModel.updateOne({ _id: id }, { username: username });
    }

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
