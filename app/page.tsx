import {getSupabaseServerClient} from "@/lib/supabase";
import Link from "next/link";
import {getVibeProfileByUserId} from "@/lib/getVibeProfileByUserId";
import Hero from "@/components/layout/hero";
import {getVibes} from "@/lib/getVibes";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {getDailyVibes} from "@/lib/getDailyVibes";
import {getVibeProfile} from "@/lib/getVibeProfile";
import HomepageLoggedOut from "@/components/layout/homepageLoggedOut";
import HomepageLoggedIn from "@/components/layout/homepageLoggedIn";

export default async function Home() {
  const supabase = await getSupabaseServerClient();

  const { data: { user }, } = await supabase.auth.getUser();

  const vibes = await getVibes('asc');

  // Get profile for logged-in user
  const profile = user ? await getVibeProfileByUserId(user.id) : null;

  // Get preview data from oldski's profile for marketing section
  const previewProfile = await getVibeProfile('oldski');
  const previewVibes = previewProfile ? await getDailyVibes(previewProfile.id) : [];

  return (
    <>
      <Hero vibes={vibes}>
        <div className={cn(
          "z-20 w-full h-screen flex flex-col justify-center items-center",
          "bg-[radial-gradient(ellipse_100%_75%_at_top,_var(--tw-gradient-stops))]",
          "from-transparent via-transparent to-neutral-50",
          "dark:from-transparent dark:via-transparent dark:to-neutral-800",
        )}>
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight">Vibe Check</h1>
          <p className="text-xl sm:text-2xl mt-4 opacity-80 font-medium">share your vibes</p>

          {user && profile ? (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href={`/v/${profile.handle}`}>See Your Vibes</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          )}
        </div>
      </Hero>

      {user && profile ? (
        <HomepageLoggedIn profile={profile} />
      ) : (
        <HomepageLoggedOut previewVibes={previewVibes} vibes={vibes} />
      )}
    </>
  );
}
