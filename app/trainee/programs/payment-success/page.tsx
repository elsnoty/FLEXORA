"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

export default function ProgramPaymentSuccess() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const [programTitle, setProgramTitle] = useState("");

    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!paymentId) {
        setIsValid(false);
        toast({
            title: "Error",
            description: "Missing payment reference",
            variant: "destructive",
        });
        router.push("/trainee/programs");
        return;
        }

        const verifyPayment = async () => {
        const supabase = createClient();
        
        // 1. Check payment status
        const { data: payment, error } = await supabase
            .from("payments")
            .select("status, program_id, metadata")
            .eq("id", paymentId)
            .single();

        if (error || !payment) {
            setIsValid(false);
            toast({
            title: "Payment Verification Failed",
            description: "Could not confirm your payment. Please contact support.",
            variant: "destructive",
            });
            router.push("/trainee/programs");
            return;
        }

        // 2. Set program title from metadata
        if (payment.metadata?.program_title) {
            setProgramTitle(payment.metadata.program_title);
        }

        // 3. Handle different payment states
        switch (payment.status) {
            case "success":
            setIsValid(true);
            toast({
                title: "Payment Confirmed!",
                description: `You now have access to "${payment.metadata?.program_title || 'the program'}"`,
            });
            break;
            case "pending":
            setIsValid(null);
            toast({
                title: "Payment Processing",
                description: "Your payment is being verified. Access will be granted shortly.",
            });
            break;
            default:
            setIsValid(false);
            toast({
                title: "Payment Issue",
                description: "There was a problem with your payment. Please try again.",
                variant: "destructive",
            });
        }

        setIsLoading(false);
        };

        verifyPayment();
    }, [paymentId, router, toast]);

    // Auto-redirect after delay
    useEffect(() => {
        if (isValid === true) {
        const timer = setTimeout(() => {
            router.push("/trainee/programs");
        }, 5000);
        return () => clearTimeout(timer);
        }
    }, [isValid, router]);

    if (isLoading) {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h1 className="text-2xl font-bold text-center">Verifying Payment...</h1>
        </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {isValid === true ? (
            <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
                Payment Successful!
            </h1>
            <p className="text-gray-600 text-center mb-4">
                You now have full access to <span className="font-semibold">"{programTitle}"</span>.
            </p>
            <p className="text-sm text-gray-500 text-center">
                Redirecting to your programs...
            </p>
            </>
        ) : isValid === false ? (
            <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
                Payment Failed
            </h1>
            <button
                onClick={() => router.push(`/programs/${searchParams.get("program_id")}`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Try Again
            </button>
            </>
        ) : (
            <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
            <h1 className="text-2xl font-bold text-center mb-2">
                Payment Processing
            </h1>
            <p className="text-gray-600 text-center">
                Please wait while we confirm your payment...
            </p>
            </>
        )}
        </div>
    );
}