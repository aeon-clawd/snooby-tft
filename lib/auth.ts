import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Email permitido para acceso admin
const ALLOWED_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "brotons22@gmail.com";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Backup: Credenciales simples
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple backup auth - solo para emergencias
        if (
          credentials?.email === ALLOWED_ADMIN_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            email: ALLOWED_ADMIN_EMAIL,
            name: "Snoodyboo",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Validar que solo el email permitido puede acceder
      if (user.email !== ALLOWED_ADMIN_EMAIL) {
        console.log(`Access denied for: ${user.email}`);
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      // Añadir info adicional a la sesión si es necesario
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
};
