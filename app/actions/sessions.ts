'use server';
import { createClient } from "@/utils/supabase/server";

export async function updateSessionStatus(
sessionId: string,
status: 'accepted' | 'rejected',
reason?: string
) {
const supabase = await createClient();

try {
const { error } = await supabase
    .from('sessions')
    .update({ 
    status,
    rejection_reason: reason || null,
    updated_at: new Date().toISOString()
    })
    .eq('id', sessionId);

if (error) {
    // Specifically handle constraint violation
    if (error.message.includes('overlapping_sessions')) {
    return {
        success: false,
        error: "You already have an accepted session during this time"
    };
    }
    throw new Error(error.message);
}

return { success: true };

} catch (error) {
    return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update session status"
    };
}
}