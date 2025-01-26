import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const currentPath = req.nextUrl.pathname;
  const user = req.auth?.user;

  if (!user) {
    return NextResponse.redirect(new URL(`/auth/login?next=${currentPath}`, req.url));
  }

  // Vérifier les permissions
  const role = user.role;

  if (currentPath.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (currentPath.startsWith("/students") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/students/:path*"],
};
