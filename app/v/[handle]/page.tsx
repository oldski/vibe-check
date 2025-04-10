import {getVibeProfile} from "@/lib/getVibeProfile";
import {notFound} from "next/navigation";
import {getDailyVibes} from "@/lib/getDailyVibes";
import VibeGrid from "@/components/vibe/vibeGrid";
import {getVibes} from "@/lib/getVibes";
import {motion} from "framer-motion";
import {getSupabaseServerClient} from "@/lib/supabase";
import Link from "next/link";
import {SmilePlus} from "lucide-react";
import MotionLink from "@/components/ui/motionLink";
import MotionButton from "@/components/ui/motionButton";



const VibeProfilePage = async ({ params }: {params: {handle: string}}) => {
	return null; // grid is already rendered in layout.tsx
	
	// const supabase = await getSupabaseServerClient();
	// const { data: { user }, } = await supabase.auth.getUser();
	//
	// const profile = await getVibeProfile(params.handle);
	// if(!profile) notFound();
	//
	// const isOwner = user?.id === profile.id;
	// const dailyVibes = await getDailyVibes(profile.id);
	// const vibes = await getVibes();
	//
	// return(
	// 	<>
	// 		<h1 className="text-3xl md:text-5xl font-bold mb-4">
	// 			{profile.display_name || `@${params.handle}`}
	// 		</h1>
	//
	// 		<p className="text-zinc-500 mb-6 text-sm italic">
	// 			“Vibe checking since {new Date(profile.created_at).toLocaleDateString()}”
	// 		</p>
	//
	// 		{isOwner ? (
	// 			<>
	// 				<p className="text-sm text-zinc-400 mb-6">This is your vibe space ✨</p>
	// 				<MotionLink href={`/v/${profile.handle}/add`} className={"fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-zinc-800 transition"}>
	// 					<SmilePlus />
	// 				</MotionLink>
	// 			</>
	// 		) : (
	// 			<p className="text-sm text-zinc-500 mb-6 italic">
	// 				@{params.handle}’s public vibe board
	// 			</p>
	// 		)}
	//
	// 		{dailyVibes && dailyVibes.length > 0 ? (
	//
	// 			<VibeGrid dailyVibes={dailyVibes} />
	// 		) : (
	// 			<motion.div
	// 				className="flex flex-col items-center justify-center text-center mt-16 gap-4"
	// 				initial={{ opacity: 0, y: 16 }}
	// 				animate={{ opacity: 1, y: 0 }}
	// 				transition={{ duration: 0.4, ease: 'easeOut' }}
	// 			>
	// 				<p className="text-zinc-500 italic text-lg">
	// 					{isOwner
	// 						? 'You haven’t added any vibes yet. Start your vibe journey now ✨'
	// 						: 'This user hasn’t shared any vibes yet.'}
	// 				</p>
	//
	// 				{/*{isOwner && (*/}
	// 				{/*	<MotionButton>*/}
	// 				{/*		whileHover={{ scale: 1.05 }}*/}
	// 				{/*		whileTap={{ scale: 0.95 }}*/}
	// 				{/*		// onClick={() => router.push(`/v/${profile.handle}/add`)}*/}
	// 				{/*		className="px-6 py-3 bg-black text-white rounded-full font-medium shadow-md hover:bg-zinc-800 transition"*/}
	// 				{/*		>*/}
	// 				{/*		*/}
	// 				{/*		<SmilePlus />*/}
	// 				{/*	</MotionButton>*/}
	// 				{/*)}*/}
	// 			</motion.div>
	// 		)}
	// 	</>
	// );
}

export default VibeProfilePage;