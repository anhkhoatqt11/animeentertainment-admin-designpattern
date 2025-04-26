import connectMongoDB from "@/lib/mongodb";
import { AuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import CredentialsModel from "@/model/credentials";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


const options: AuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials, req) {
                const { loginid, password } = credentials as {
                    loginid: string;
                    password: string;
                };
                await connectMongoDB();
                const user = await CredentialsModel.findOne({ loginid });

                console.log(user);
                if (!user) {
                    return null;
                }
                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (!passwordsMatch) {
                    return null;
                }
                return {
                    id: user._id,
                    name: user.username,
                    loginid: user.loginid,
                    role: user.role,
                    status: user.status,
                }
            }
        }),
    ],
    callbacks: {
        async signIn(params) {
            console.log('paramssssssssssssssssssssssssssssssssssssssssssssss: ');
            console.log(params);
            if (!params?.user?.id || parseInt(params?.user?.id) === -1) {
                const payload = jwt.sign(
                    { email: params?.user?.email, name: params?.user?.name },
                    process.env.NEXT_PUBLIC_JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return `/auth/register/?payload=${payload}`;
            }

            return true;
        },

        async jwt({ token, user, trigger, session }) {
            console.log('user in jwt: ');
            console.log(token);
            console.log(user);
            if (trigger === 'update') {
                return { ...token, ...session.user };
            }
            if (user) {
                token.role = user.role;
                token.id = user.id;
                // token.avatar = user.avatar;
                token.name = user.name;
                token.loginid = user.loginid;
                token.status = user.status;
                // token.email = user.email;
                // token.isEmailVerified = user.isVerified;
            }
            //user is from the oauth config or in the credentials setting options

            //return final token
            return token;
        },
        async session({ token, session }) {
            // if (!userFind) {
            //   return {
            //     redirectTo: `/auth/login?email=${session?.user.email}&name=${session?.user.name}`,
            //   };
            // }

            if (session.user) {
                (session.user as { id: string }).id = token.id as string;
                (session.user as { name: string }).name = token.name as string;
                (session.user as { role: string }).role = token.role as string;
                (session.user as { loginid: string }).loginid = token.loginid as string;
                (session.user as { status: string }).status = token.status as string;
                // (session.user as { avatar: string }).avatar = token.avatar as string;
                // (session.user as { email: string }).email = token.email as string;
                // (session.user as { isEmailVerified: boolean }).isEmailVerified =
                //     token.isEmailVerified as boolean;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },

};

export default options;
