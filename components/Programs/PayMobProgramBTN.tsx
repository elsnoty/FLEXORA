"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { handleError } from "@/utils/errorHandling";

export function ProgramPayButton({ programId }: { programId: string }) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const supabase = createClient();
    const router = useRouter();

    async function handlePurchase() {
        setLoading(true);
        try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
        router.push('/login');
        return;
        }
        
        const { data: billingInfo, error } = await supabase
            .from("billing_info")
            .select("*")
            .eq("user_id", user?.id)
            .single();

            if (error || !billingInfo) {
            toast({
                title: "Billing Info Required",
                description: "Please complete your billing information first",
                variant: "destructive",
            });
            router.push(`/trainee/profile/${user.id}`);
            return;
            }
        const res = await fetch("/api/payment/program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            programId,
            traineeId: user.id
        })
        });
    
        const data = await res.json();
    
        if (!res.ok) {
        // Handle "already purchased" case specially
        if (data.code === "PROGRAM_ALREADY_PURCHASED") {
            toast({
            title: "Already Purchased",
            description: data.error,
            variant: "default"
            });
            router.push('/trainee/programs'); 
            return;
        }
        throw new Error(data.error || "Payment failed");
        }
    
        const { redirect_url } = data;
        window.location.href = redirect_url;
    
    } catch (error) {
        if (!(error instanceof Error && error.message.includes("already own"))) {
        toast({
            title: "Error",
            description: handleError(error, "Payment Failed"),
            variant: "destructive"
        });
        }
    } finally {
        setLoading(false);
    }
    }

    return (
        <Button 
        onClick={handlePurchase} 
        disabled={loading}
        className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-semibold px-6 py-2 rounded-xl transition-all shadow-md"
        >
        {loading ? (
            <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Processing...
            </>
        ) : "Buy Program"}
        </Button>
    );
}