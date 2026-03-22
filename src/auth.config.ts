import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// File này chỉ chứa các cấu hình tương thích với Edge runtime (không dùng crypto hay prisma)
export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        MicrosoftEntraID({
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
            clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
            issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
} satisfies NextAuthConfig;
