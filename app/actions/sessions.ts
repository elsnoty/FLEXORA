'use server';
import { createClient } from "@/utils/supabase/server";

export async function updateSessionStatus(
    sessionId: string,
    status: 'accepted' | 'rejected',
    reason?: string
    ) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('sessions')
        .update({ 
        status,
        rejection_reason: reason || null 
        })
        .eq('id', sessionId);

    if (error) throw error;
}