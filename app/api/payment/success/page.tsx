// app/payment/success/page.tsx
"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentSuccessContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast({
        title: "Payment Successful!",
        description: "Your session has been booked.",
        variant: "default",
      });
    }
  }, [sessionId, toast]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">🎉 Payment Confirmed</h1>
      <p className="mt-2">Your session is now scheduled.</p>
      <Button className="mt-4" asChild>
        <Link href="/trainee">Go to Dashboard</Link>
      </Button>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading payment confirmation...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}