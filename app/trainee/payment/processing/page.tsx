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
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [dots, setDots] = useState(".");

    // Animate dots
    useEffect(() => {
        if (!isRedirecting) return;

        const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : "."));
        }, 500);

        return () => clearInterval(interval);
    }, [isRedirecting]);

    useEffect(() => {
        if (!paymentId) {
        setIsValid(false);
        setTimeout(() => {
            toast({
            title: "Error",
            description: "Missing payment reference",
            variant: "destructive",
            });
            router.push("/trainee");
        }, 0);
        return;
        }

        setIsValid(true);

        setTimeout(() => {
        toast({
            title: "Payment Received",
            description: "Your payment is being confirmed. You’ll be redirected to your dashboard.",
        });
        }, 0);

        setIsRedirecting(true);

        const timer = setTimeout(() => {
        router.push("/trainee");
        }, 4000);

        return () => clearTimeout(timer);
    }, [paymentId, toast, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>

        {isValid && (
            <>
            <h1 className="text-2xl font-bold text-center mb-2">
                Processing Your Payment
            </h1>
            <p className="text-gray-600 text-center mb-4">
                Your payment has been received and is being processed.
            </p>
            {isRedirecting && (
                <p className="text-sm text-gray-500 text-center">
                Redirecting to your dashboard{dots}
                </p>
            )}
            </>
        )}
        </div>
    );
}
