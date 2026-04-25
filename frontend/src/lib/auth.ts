import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ADMIN_EMAIL = "zevkapilrc@gmail.com";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async signIn({ user }) {
            // Allow all Google sign-ins
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
                token.isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).isAdmin = token.isAdmin;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "careeriq-secret-key-dev-only",
};
