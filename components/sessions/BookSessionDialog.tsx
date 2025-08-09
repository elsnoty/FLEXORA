'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { BookingSummary } from "./BookingSummary";
import { DurationPicker } from "./durationPicker";
import { TimeSlotPicker } from "./TimeSLotPicker";
import { useRouter } from "next/navigation";

export default function BookSessionPopover({ trainerId }: { trainerId: string }) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
    const [duration, setDuration] = useState<number>(1);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingCheck, setLoadingCheck] = useState(true);
    const [alreadyBooked, setAlreadyBooked] = useState(false);
    const { toast } = useToast();
    const router = useRouter()

    useEffect(() => {
    const checkBooking = async () => {
    setLoadingCheck(true);
    try {
        const res = await fetch(`/api/sessions/check?trainerId=${trainerId}`);
        const data = await res.json();
        setAlreadyBooked(data.hasBooked);
        router.refresh()
    } catch (error) {
        console.error("Failed to check booking status:", error);
    } finally {
        setLoadingCheck(false);
    }
    };

    checkBooking();
    }, [trainerId, open, router]);
    
    const handleBooking = async () => {
    if (!date || !selectedTime) return;

    const startTime = new Date(date);
    startTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

    setLoading(true);
    try {
        const res = await fetch("/api/sessions/TraineeBook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                trainerId,
                date: startTime.toISOString(),
                durationHours: duration,
            }),
        });

        if (!res.ok) throw new Error("Booking failed");

        toast({ title: "Success!", description: `Session booked for ${duration} hour(s)` });
        setOpen(false);
        setAlreadyBooked(true);
        setDate(undefined); // Reset date
        setSelectedTime(undefined); // Reset time
        setDuration(1); // Reset duration
        router.refresh(); // Refresh the page data
    } catch (error) {
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Booking failed",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
        <Button 
            disabled={alreadyBooked || loadingCheck} 
            className="gap-2"
            >
            {loadingCheck ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : alreadyBooked ? (
                "Already Booked"
            ) : (
                <>
                <CalendarIcon className="h-4 w-4" />
                Book Session
                </>
            )}
        </Button>
        </PopoverTrigger>

        <PopoverContent 
            className="w-[90vw] max-w-md p-4 space-y-4" 
            align="center"
            onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest('.rdp')) {
                e.preventDefault();
            }
            }}
        >
            <div className="space-y-4">
            <div>
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Pick a Date
                </div>
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(day) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 
                    return day < today;
                }}
                />
            </div>

            {date && (
                <>
                <TimeSlotPicker 
                    value={selectedTime} 
                    onChange={setSelectedTime} 
                />
                <DurationPicker 
                    value={duration} 
                    onChange={setDuration} 
                />
                <BookingSummary 
                    date={date} 
                    time={selectedTime} 
                    duration={duration} 
                />
                </>
            )}

            <Button
                onClick={handleBooking}
                disabled={!date || !selectedTime || loading}
                className="w-full gap-2 sticky bottom-0"
            >
                {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Booking...
                </>
                ) : (
                "Confirm Booking"
                )}
            </Button>
            </div>
        </PopoverContent>
        </Popover>
    );
}