import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { scryptSync, timingSafeEqual } from "crypto";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !user.password) return null;

                const [salt, storedHash] = user.password.split(":");
                const hash = scryptSync(credentials.password as string, salt, 64).toString("hex");

                const isValid = timingSafeEqual(
                    Buffer.from(hash),
                    Buffer.from(storedHash)
                );

                if (!isValid) return null;

                return user;
            }
        })
    ],
    callbacks: {
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
});
