"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingInfoSheet } from "./BilingInfoSheet";

type BillingInfo = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    country: string;
    city: string;
};

export default function BillingInfoCard({
    userId,
    billingInfo,
    }: {
    userId: string;
    billingInfo: BillingInfo | null;
    }) {
    if (!billingInfo) {
        return (
        <Card className="mt-6 w-full max-w-2xl border-yellow-400 bg-yellow-50">
            <CardHeader>
            <CardTitle className="text-yellow-800">Billing Info Needed</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-sm text-yellow-800">
                You must complete your billing information before booking or buying programs.
            </p>
            </CardContent>
            <CardFooter>
            <BillingInfoSheet userId={userId} />
            </CardFooter>
        </Card>
        );
    }

    return (
        <Card className="mt-6 w-full max-w-2xl">
        <CardHeader>
            <CardTitle>Billing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <p>
            <strong>Name:</strong> {billingInfo.first_name} {billingInfo.last_name}
            </p>
            <p>
            <strong>Email:</strong> {billingInfo.email}
            </p>
            <p>
            <strong>Phone:</strong> {billingInfo.phone_number || "N/A"}
            </p>
            <p>
            <strong>Country:</strong> {billingInfo.country}
            </p>
            <p>
            <strong>City:</strong> {billingInfo.city}
            </p>
        </CardContent>
        <CardFooter>
            <BillingInfoSheet userId={userId} />
        </CardFooter>
        </Card>
    );
}
