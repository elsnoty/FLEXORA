"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentFailedContent() {
const { toast } = useToast();
const router = useRouter();
const searchParams = useSearchParams();
const sessionId = searchParams.get("session_id");

useEffect(() => {
    if (sessionId) {
    toast({
        title: "Payment Failed!",
        description: "There was an issue with your payment. Please try again.",
        variant: "destructive",
    });

    // Auto-redirect to payment retry or home after 5 seconds
    const timer = setTimeout(() => {
        router.push("/trainee/payment"); // Adjust to your retry page or home
    }, 5000);

    return () => clearTimeout(timer);
    }
}, [sessionId, toast, router]);

return (
    <div className="p-4 text-center">
    <h1 className="text-2xl font-bold text-red-600">😞 Payment Failed</h1>
    <p className="mt-2 text-gray-700">Unfortunately, your payment could not be processed.</p>
    <p className="mt-2 text-sm text-gray-600">Redirecting to payment page in 5 seconds...</p>
    <Button className="mt-4 bg-red-500 hover:bg-red-600 text-white" asChild>
        <Link href="/trainee/payment">Try Again</Link>
    </Button>
    </div>
);
}

export default function PaymentFailed() {
return <PaymentFailedContent />;
}