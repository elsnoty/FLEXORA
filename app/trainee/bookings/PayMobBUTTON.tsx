"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PayButtonProps {
    sessionId: string;
    }

    export function PayButton({ sessionId }: PayButtonProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleProceedToPay() {
        setLoading(true);
        try {
        const res = await fetch("/api/payment", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ sessionId })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Payment error:", data);

            if (data.code === "SESSION_ALREADY_PAID") {
            toast({
                title: "Session Already Paid",
                description: "This session has already been paid for. Please check your bookings.",
                variant: "destructive",
            });
            setTimeout(() => {
                router.push("/trainee/bookings");
            }, 2000);
            return;
            }

            toast({
            title: "Payment Error",
            description: data.error || "Failed to initiate payment. Please try again.",
            variant: "destructive",
            });
            return;
        }

        if (data.redirect_url) {
            router.push(data.redirect_url);
        } else {
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
        } finally {
        setLoading(false);
        }
    }

    return (
        <Button
        onClick={handleProceedToPay}
        disabled={loading}
        className="w-full sm:w-auto mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-semibold px-6 py-2 rounded-xl transition-all shadow-md"
        >
        {loading ? (
            <span className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" /> Processing...
            </span>
        ) : (
            "Pay Now"
        )}
    </Button>
    );
}