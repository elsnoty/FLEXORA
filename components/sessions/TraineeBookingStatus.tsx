'use client';
export function BookingStatus({ 
    hasBooked, 
    status 
    }: { 
    hasBooked: boolean; 
    status?: string | null 
    }) {
    if (!hasBooked) return null;

    const statusMessages = {
    pending: "Waiting for trainer approval",
    accepted: "Session approved - Payment pending",
    rejected: "Your previous booking was rejected"
    };

    return (
    <div className="text-sm text-muted-foreground mt-2">
        {statusMessages[status as keyof typeof statusMessages] || 
        "You already have an active booking"}
    </div>
    );
}