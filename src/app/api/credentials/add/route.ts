import connectMongoDB from "@/lib/mongodb";
import CredentialsModel from "@/model/credentials";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
  try {
    const { username, loginid, password, role, status } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    await CredentialsModel.create({
      username,
      loginid,
      password: hashedPassword,
      role,
      status,
    });

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
