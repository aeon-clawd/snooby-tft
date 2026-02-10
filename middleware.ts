import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Si está autenticado y accede a /admin, permitir
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Solo permitir si hay token (usuario autenticado)
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Proteger todas las rutas que empiecen con /admin
export const config = {
  matcher: ["/admin/:path*"],
};
