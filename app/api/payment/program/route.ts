import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const { programId, traineeId } = await req.json();
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
        const supabase = await createClient();
        // 1. Fetch program details
        if (!traineeId) {
            return NextResponse.json(
                { error: "Missing trainee ID" },
                { status: 400 }
                );
            }
        const { data: program, error: programError } = await supabase
            .from("training_programs")
            .select("price, trainer_id, name, description")
            .eq("id", programId)
            .single();

            if (programError) {
            console.error("Supabase query error:", programError);
            return NextResponse.json(
                { error: programError.message }, 
                { status: 404 }
            );
            }


        // 2. Check if already purchased
        const { data: existingPurchase } = await supabase
        .from("program_access")
        .select("*")
        .eq("trainee_id", traineeId)
        .eq("program_id", programId)
        .maybeSingle();

        if (existingPurchase) {
        return NextResponse.json(
            { 
            error: "You already own this program",
            code: "PROGRAM_ALREADY_PURCHASED" 
            },
            { status: 400 }
        );
        }

        // 3. Create payment record
        const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
            trainee_id: traineeId,
            program_id: programId,
            amount: program.price,
            status: "pending",
            method: "paymob",
        })
        .select()
        .single();

        if (paymentError) throw paymentError;
    
        //4- billing info
        const { data: billing, error: billingError } = await supabase
            .from("billing_info")
            .select("first_name, last_name, email, phone_number, country, city")
            .eq("user_id", traineeId)
            .single();

            if (billingError || !billing) {
            return NextResponse.json(
                { error: "Billing information not found. Please complete your profile first." },
                { status: 400 }
            );
            }

        // 4. Initiate Paymob payment
        const paymobResponse = await fetch('https://accept.paymob.com/v1/intention/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${process.env.PAYMOB_SECRET_KEY}`
        },
        body: JSON.stringify({
            amount: Math.round(program.price * 100),
            currency: "EGP",
            payment_methods: [5047697], 
            items: [{
            name: `Program: ${program.name}`,
            amount: Math.round(program.price * 100),
            description: `${program.description}`,
            //apply this if you applied the commented area in the webhook
            // description: `Flexora Program Purchase (ID:${payment.id})`,
            }],
            billing_data: {
                first_name: billing.first_name,
                last_name: billing.last_name,
                phone_number: billing.phone_number || "+201000000000", // fallback
                email: billing.email,
                country: billing.country || "EGY", // fallback
                city: billing.city || "Cairo",    // fallback
            },
            merchant_order_id: payment.id,
            expiration: 3600,
            notification_url: `${BASE_URL}/api/webhook`,
            redirection_url: `${BASE_URL}/trainee/programs/payment-success?payment_id=${payment.id}`,
        })
        });

        if (!paymobResponse.ok) {
        const errorData = await paymobResponse.json();
        return NextResponse.json(
            { error: "PayMob API error", details: errorData },
            { status: paymobResponse.status }
        );
        }

        const { client_secret } = await paymobResponse.json();
        return NextResponse.json({
        redirect_url: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`
        });

    } catch (error) {
        return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Payment failed' },
        { status: 500 }
        );
    }
}