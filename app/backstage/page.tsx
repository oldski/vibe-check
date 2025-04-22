import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getVibes } from "@/lib/getVibes";
import VibeForm from "@/components/vibe/vibeForm";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  
  const vibes = await getVibes();
  
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="text-2xl font-bold mb-4">Backstage</h1>
      
      
      <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
      </a>
      
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">🎵 Connected Music Services</h2>
        <ul>
          <li>[✓] Spotify         [Connect | Disconnect]</li>
          <li>[ ] YouTube Music   [Connect]</li>
          <li>[ ] Apple Music     [Connect]</li>
        </ul>
        
        
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
    </div>
  );
}
