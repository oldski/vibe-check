import {getSupabaseServerClient} from "@/lib/supabase";
import Link from "next/link";
import {getVibeProfileByUserId} from "@/lib/getVibeProfileByUserId";
import Hero from "@/components/layout/hero";
import {getVibes} from "@/lib/getVibes";
import {cn} from "@/lib/utils";

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  
  const { data: { session }, } = await supabase.auth.getSession();
  const { data: { user }, } = await supabase.auth.getUser();
  
  const isLoggedIn = !!session
  
  if(!user){
    return <Link href={'/sign-in'}>Log in</Link>
  }
  
  const profile = await getVibeProfileByUserId(user.id);
  const vibes = await getVibes('asc');
  
  
  
  return (
    <>
      <Hero vibes={vibes}>
        <>
          <div className={cn("z-20 w-full h-screen flex flex-col justify-center items-center",
            "bg-[radial-gradient(ellipse_100%_75%_at_top,_var(--tw-gradient-stops))]",
            "from-transparent via-neutral-transparent to-neutral-50",
            "dark:from-transparent dark:via-transparent dark:to-neutral-800",
            )}>
            <h1 className="text-7xl font-extrabold">Vibe Check</h1>
            <Link href={`/v/${profile.handle}`}>See your Vibe Check</Link>
          </div>
        </>
      </Hero>
      <section className={"h-96"}>
        <h2>vibe out</h2>
      </section>
    </>
  );
}
