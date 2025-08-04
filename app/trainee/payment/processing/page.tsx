// trainee/payment/processing/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function PaymentResult() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!paymentId) {
            toast({
                title: "Error",
                description: "Missing payment reference",
                variant: "destructive",
            });
            // Redirect to login instead of assuming user role
            router.push("/login");
            return;
        }

        // Show processing message
        toast({
            title: "Payment Received",
            description: "Your payment is being confirmed. You'll be redirected to login to continue.",
            variant: "default",
        });

        // Set redirecting state
        setIsRedirecting(true);

        // Redirect to login after delay since we don't have user context
        const timer = setTimeout(() => {
            router.push("/login");
        }, 4000);

        return () => clearTimeout(timer);
    }, [paymentId, toast, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h1 className="text-2xl font-bold text-center mb-2">Processing Your Payment</h1>
            <p className="text-gray-600 text-center mb-4">
                Your payment has been received and is being processed.
            </p>
            {isRedirecting && (
                <p className="text-sm text-gray-500 text-center">
                    You&apos;ll be redirected to login shortly to access your dashboard...
                </p>
            )}
        </div>
    );
}