'use client';
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export default function DeleteProfileButton({ userId, role }: { userId: string, role: 'trainer' | 'trainee' }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Validate props
    if (!userId || typeof userId !== 'string' || !['trainer', 'trainee'].includes(role)) {
        return null;
    }

    const handleDeleteProfile = async () => {
        setIsDeleting(true);
        setErrorMessage(null);

        try {
        const response = await fetch('/api/delete-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete account');
        }

        window.location.href = "/?deleted=true";
        } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during deletion');
        } finally {
        setIsDeleting(false);
        }
    };

    const handleCloseDeleteDialog = () => {
        setErrorMessage(null);
        setIsDeleteDialogOpen(false);
    };

    return (
        <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Trigger asChild>
            <Button
            variant="destructive"
            className="mt-4"
            disabled={isDeleting}
            aria-label="Delete account permanently"
            >
            Delete Account Permanently
            </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg max-w-md w-full z-[9999]"
            aria-describedby="dialog-description"
            >
            <Dialog.Title className="text-lg font-semibold">Are you absolutely sure?</Dialog.Title>
            
            <div id="dialog-description" className="text-sm text-muted-foreground mt-2">
                <div>This action cannot be undone. This will permanently:</div>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Delete your profile and all personal information</li>
                <li>Remove your login account completely</li>
                <li>Delete all your {role === 'trainer' ? 'training programs and sessions' : 'scheduled sessions and bookings'}</li>
                <li>Cancel any associated payments and subscriptions</li>
                {role === 'trainer' && <li>Remove all client connections and data</li>}
                </ul>
                <Dialog.Description className="mt-3 font-medium text-destructive">
                    This action is permanent and cannot be recovered.
                </Dialog.Description>

                {errorMessage && (
                <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md mt-3">
                    <strong>Error:</strong> {errorMessage}
                </div>
                )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Dialog.Close asChild>
                <Button
                    variant="outline"
                    disabled={isDeleting}
                    onClick={handleCloseDeleteDialog}
                    aria-label="Cancel account deletion"
                >
                    Cancel
                </Button>
                </Dialog.Close>
                <Button
                onClick={handleDeleteProfile}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                aria-label="Confirm account deletion"
                >
                {isDeleting ? (
                    <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                    </>
                ) : (
                    "Delete Everything"
                )}
                </Button>
            </div>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    );
}