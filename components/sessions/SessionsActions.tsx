'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateSessionStatus,  } from "@/app/actions/sessions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { handleError } from "@/utils/errorHandling";

export function SessionActions({ sessionId }: { sessionId: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {

        setIsLoading(true);
        try {
            const result = await updateSessionStatus(sessionId, 'accepted');
            if (result?.success) {
            toast({ title: "Session accepted!" });
            router.refresh();
            } else {
            toast({
                title: "Couldn't accept session",
                description: result?.error || "Time conflict exists",
                variant: "destructive"
            });
            setIsLoading(false);
            }
        } catch (error) {
            toast({
            title: "Unexpected error",
            description: handleError(error,"Please try again later"),
            variant: "destructive" 
            });
        }
    };

    const handleReject = async () => {
        try {
        await updateSessionStatus(sessionId, 'rejected', rejectionReason || undefined);
        toast({ title: "Session rejected" });
        setIsDialogOpen(false);
        setRejectionReason("");
        router.refresh();
        } catch {
        toast({ title: "Error rejecting session", variant: "destructive" });
        }
    };

    return (
        <div className="flex gap-2 mt-3">
        <Button onClick={handleAccept} disabled={isLoading}>
        {isLoading ? "Processing..." : "Accept"}
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
            <Button variant="destructive">Reject</Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Reject Session</DialogTitle>
            </DialogHeader>

            <Textarea
                placeholder="Reason for rejection (optional)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
            />

            <DialogFooter>
                <Button
                variant="destructive"
                onClick={handleReject}
                disabled={false}
                >
                Confirm Rejection
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
    );
}
