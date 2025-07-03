'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateSessionStatus } from "@/app/actions/sessions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SessionActions({ sessionId }: { sessionId: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleAccept = async () => {
        try {
        await updateSessionStatus(sessionId, 'accepted');
        toast({ title: "Session accepted" });
        router.refresh();
        } catch {
        toast({ title: "Error accepting session", variant: "destructive" });
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
        <Button onClick={handleAccept}>
            Accept
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
