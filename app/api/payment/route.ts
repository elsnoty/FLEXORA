// Updated payment creation API with correct URLs
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const { sessionId } = await req.json();
        const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY!;
        const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY!;
        
        // Use your actual domain instead of ngrok
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
        
        const supabase = await createClient();

        const { data: session } = await supabase
            .from("trainee_bookings_view")
            .select('*')
            .eq("id", sessionId)
            .single();
        
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

        // Create payment record
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .insert({
                trainee_id: session.trainee_id,
                session_id: sessionId,
                amount: session.total_amount,
                status: 'pending',
                method: 'paymob'
            })
            .select()
            .single();

        if (paymentError) throw paymentError;

        const paymobResponse = await fetch('https://accept.paymob.com/v1/intention/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${PAYMOB_SECRET_KEY}`
            },
            body: JSON.stringify({
                amount: Math.round(session.total_amount * 100),
                currency: "EGP",
                payment_methods: [5047697],
                items: [
                    {
                        name: "Training Session",
                        amount: Math.round(session.total_amount * 100),
                        description: `Session with ${session.trainer_name} (Payment ID:${payment.id})`,
                        quantity: 1,
                    },
                ],
                billing_data: {
                    apartment: "1",
                    first_name: session.trainee_first_name || "Trainee",
                    last_name: session.trainee_last_name || "User",
                    street: "Test Street",
                    building: "123",
                    phone_number: session.trainee_phone || "+201000000000",
                    country: "EGY",
                    email: session.trainee_email || "user@example.com",
                    floor: "2",
                    state: "Giza"
                },
                merchant_order_id: payment.id, // This is correct
                expiration: 3600,
                // WEBHOOK - where PayMob sends transaction status
                notification_url: `${BASE_URL}/api/webhook`,
                // REDIRECT - where user is sent after payment
                redirection_url: `${BASE_URL}/trainee/payment/processing?payment_id=${payment.id}`,
            })
        });

        if (!paymobResponse.ok) {
            const errorData = await paymobResponse.json();
            console.error("PayMob API error:", errorData);
            return NextResponse.json({ error: "PayMob API error", details: errorData }, { status: paymobResponse.status });
        }

        const paymobData = await paymobResponse.json();
        const clientSecret = paymobData.client_secret;

        if (!clientSecret) {
            return NextResponse.json({ error: "Missing client_secret" }, { status: 500 });
        }

        const paymobCheckoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;

        return NextResponse.json({
            redirect_url: paymobCheckoutUrl, 
        });
        
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}