import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { sessionId } = await req.json();
        const PaymobSECRET_CLIENT = "egy_sk_test_bddcd59083b6fe6a5637fbd1b0f4dfc2d9e28792737779463d4e0f08e5332987";
        const PaymobPUBLIC_KEY = "egy_pk_test_TKqEkzmFQN8RnC5VJTREnZnUdDjb9CX9"
        const supabase = await createClient();

        const { data: session } = await supabase
            .from("trainee_bookings_view")
            .select('*')
            .eq("id", sessionId)
            .single();
        
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

        // Step 1: Create PayMob payment intention
        const paymobResponse = await fetch('https://accept.paymob.com/v1/intention/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${PaymobSECRET_CLIENT}`
            },
            body: JSON.stringify({
                amount: session.total_amount * 100,
                currency: "EGP",
                payment_methods: [5047718, 5047697],
                billing_data: {
                    apartment: "1",
                    first_name: session.trainee_first_name || "Trainee",
                    last_name: session.trainee_last_name || "User",
                    street: "Test Street",
                    building: "123",
                    phone_number: session.trainee_phone || "+201000000000",
                    country: "EGY",
                    email: session.trainee_email || "trainee@example.com",
                    floor: "2",
                    state: "Giza"
                }
            })
        });

        // First check if the response is OK
        if (!paymobResponse.ok) {
            console.error("PayMob API error");
            return NextResponse.json({ error: "PayMob API error" }, { status: paymobResponse.status });
        }

        // Step 2: Extract client_secret from the response
        const paymobData = await paymobResponse.json();
        const clientSecret = paymobData.client_secret;

        if (!clientSecret) {
            return NextResponse.json({ error: "Missing client_secret" }, { status: 500 });
        }
        
        // Step 3: Generate PayMob checkout URL
        const paymobCheckoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${PaymobPUBLIC_KEY}&clientSecret=${clientSecret}&success_url=
        ${encodeURIComponent("https://supa-base-test-xi.vercel.app/api/payment/success?session_id=" + sessionId)}`;

        return NextResponse.json({
        redirect_url: paymobCheckoutUrl, 
        });
        
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}