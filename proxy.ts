import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Locale-prefixed routing (Next 16 proxy.ts — formerly middleware.ts).
 *
 * - "/" rewrites internally to "/{defaultLocale}" so the user-visible URL
 *   stays clean while the file system has app/[locale]/page.tsx.
 * - "/pt", "/pt/...", etc. pass through.
 * - Static files and Next internals (_next, api, public-file extensions) bypass.
 * - Sets `x-locale` request header so the root layout can render <html lang>
 *   server-side without a flash.
 * - Cookie-based redirect: on bare "/", if `NEXT_LOCALE` is a valid non-default
 *   locale (e.g. `pt`), 307-redirect to that locale's prefix so return visits
 *   land in the user's chosen language. Deep links (e.g. `/pt`, `/anything`)
 *   bypass cookie logic — explicit URLs always win.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Already locale-prefixed (e.g. /pt) — forward x-locale and continue.
  if (first && isLocale(first)) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", first);
    return NextResponse.next({ request: { headers } });
  }

  // Cookie-based redirect: only on root "/" — deep links are sticky.
  if (pathname === "/") {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (
      cookieLocale &&
      isLocale(cookieLocale) &&
      cookieLocale !== defaultLocale
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/${cookieLocale}`;
      return NextResponse.redirect(url, 307);
    }
  }

  // No locale prefix and no relevant cookie — rewrite internally to default.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  const headers = new Headers(request.headers);
  headers.set("x-locale", defaultLocale);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    /**
     * Match every path except:
     *   - _next internals
     *   - api routes
     *   - static assets (anything with a file extension)
     */
    "/((?!_next/|api/|.*\\..*).*)",
  ],
};
