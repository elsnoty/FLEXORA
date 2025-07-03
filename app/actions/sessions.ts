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

export async function createPaymentIntent(sessionId: string) {
    const supabase = await createClient();
    
    // Get session details
    const { data: session } = await supabase
        .from('sessions')
        .select('*, trainers(hourly_rate)')
        .eq('id', sessionId)
        .single();

    if (!session) throw new Error("Session not found");

    // Create payment intent (simplified example)
    const { data, error } = await supabase
        .from('payment_intents')
        .insert({
        session_id: sessionId,
        amount: session.trainers.hourly_rate,
        status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;
    
    // In real app, integrate with Stripe here
    return data.id;
    }