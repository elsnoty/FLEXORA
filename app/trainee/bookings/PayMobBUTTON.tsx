"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface PayButtonProps {
    sessionId: string;
    }

    export function PayButton({ sessionId }: PayButtonProps) {
    const router = useRouter();
        const {toast} = useToast()
    async function handleProceedToPay() {
        try {
        const res = await fetch("/api/payment", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ sessionId })
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error("Payment error:", errorData);
            toast({
            title: "Payment Error",
            description: "Failed to initiate payment. Please try again.",
            variant: "destructive",
            });
            return;
        }

        const data = await res.json();
        if (data.redirect_url) {
            router.push(data.redirect_url);
        } else {
            console.error("Missing redirect URL:", data);
            toast({
            title: "Payment Error",
            description: "Payment link not available. Please try again.",
            variant: "destructive",
            });
        }
        } catch (error) {
        console.error("Payment error:", error);
        toast({
            title: "Payment Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
        });
        }
    }

    return (
        <Button className="mt-4" onClick={handleProceedToPay}>
        Proceed to Payment
        </Button>
    );
}