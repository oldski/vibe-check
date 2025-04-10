import { NextResponse } from "next/server";
import { updateDailyVibe } from "@/lib/updateDailyVibe";

export async function POST(req: Request){
	try{
		const body = await req.json();
		
		await updateDailyVibe({
			id: body.id,
			vibe_date: body.vibe_date,
			message: body.message,
			audio: body.audio,
			media: body.media,
			vibe: parseInt(body.vibe),
		})
		
		return NextResponse.json({ success: true });
	} catch(e){
		const message = e instanceof Error ? e.message : 'Unknown error'
		return NextResponse.json({ error: message }, { status: 500 });
	}
}