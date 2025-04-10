import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { putDailyVibe } from "@/lib/putDailyVibes";

export async function POST(req: Request){
	try{
		const supabase = await getSupabaseServerClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();
		
		if (!user || error) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
		}
		
		const body = await req.json();
		
		await putDailyVibe({
			profile_id: user.id,
			vibe_date: body.vibe_date,
			message: body.message,
			audio: body.audio,
			media: body.media,
			vibe: parseInt(body.vibe),
		});
		
		return NextResponse.json({ success: true });
	} catch(e){
		const message = e instanceof Error ? e.message : 'Unknown error'
		return NextResponse.json({ error: message }, { status: 500 });
	}
}