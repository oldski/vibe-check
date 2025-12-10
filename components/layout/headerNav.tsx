import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { User, LogOut, Settings } from "lucide-react";

export default async function HeaderNav() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's handle if logged in
  let handle: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('handle')
      .eq('id', user.id)
      .single();
    handle = profile?.handle ?? null;
  }

  if (user) {
    return (
      <nav className="flex items-center gap-6">
        {handle && (
          <Link
            href={`/v/${handle}`}
            className="text-sm hover:opacity-70 transition-opacity inline-flex items-center gap-2"
          >
            <User size={16} className="shrink-0" />
            <span className="hidden sm:inline leading-none">My Vibes</span>
          </Link>
        )}
        <Link
          href="/backstage"
          className="text-sm hover:opacity-70 transition-opacity inline-flex items-center gap-2"
        >
          <Settings size={16} className="shrink-0" />
          <span className="hidden sm:inline leading-none">Backstage</span>
        </Link>
        <form action={signOutAction} className="inline-flex">
          <button
            type="submit"
            className="text-sm hover:opacity-70 transition-opacity inline-flex items-center gap-2"
          >
            <LogOut size={16} className="shrink-0" />
            <span className="hidden sm:inline leading-none">Sign out</span>
          </button>
        </form>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/sign-in"
        className="text-sm hover:opacity-70 transition-opacity"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="text-sm bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
      >
        Sign up
      </Link>
    </nav>
  );
}
