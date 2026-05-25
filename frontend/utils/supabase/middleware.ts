import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });
  let pendingCookies: Array<{ name: string; value: string; options: any }> = [];

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pendingCookies = cookiesToSet;

        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresca la sesión sin bloquear — necesario para que las cookies se actualicen
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname !== '/login') {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url));

    pendingCookies.forEach(({ name, value, options }) => {
      redirectResponse.cookies.set(name, value, options);
    });

    return redirectResponse;
  }

  return supabaseResponse;
};
