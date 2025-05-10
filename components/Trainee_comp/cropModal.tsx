'use client';
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropp_image";
import { useToast } from "@/hooks/use-toast";

    interface CropModalProps {
    file: File | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (croppedFile: File) => void;
    }

    export default function CropModal({ file, isOpen, onClose, onConfirm }: CropModalProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const { toast } = useToast();

    // Load image when file changes
    if (file && !imageSrc) {
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(file);
    }

    // Reset state when modal closes
    const handleClose = () => {
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        onClose();
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropConfirm = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        onConfirm(croppedFile);
        handleClose();
        } catch (err) {
            console.error(err);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to crop image",
        });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogTitle>Crop Avatar</DialogTitle>
            <DialogDescription>
            Adjust the image to fit your avatar. Use pinch or scroll to zoom.
            </DialogDescription>
            {imageSrc && (
            <div className="relative w-full h-64">
                <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                />
            </div>
            )}
            <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
                Cancel
            </Button>
            <Button onClick={handleCropConfirm}>Confirm Crop</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}