import { createClient } from '@/utils/supabase/server'
import {NextResponse} from "next/server";
import {deleteDailyVibe} from "@/lib/deleteDailyVibe";

export async function POST(req: Request){
	try{
		const { id } = await req.json();
		
		if(!id){
			return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
		}
		
		await deleteDailyVibe(id);
		return NextResponse.json({ success: true });
	} catch (e){
		const message = e instanceof Error ? e.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}