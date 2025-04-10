import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import {getSupabaseServerClient} from "@/lib/supabase";
import Link from "next/link";

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  
  
  const { data: { session }, } = await supabase.auth.getSession();
  const { data: { user }, } = await supabase.auth.getUser();
  
  const isLoggedIn = !!session
  
  return (
    <>
      {isLoggedIn ? (
        <Link href={'/v/oldski'}>See your Vibe Check</Link>
      ) : (
        <Link href={'/sign-in'}>Log in</Link>
      )}
    </>
  );
}
