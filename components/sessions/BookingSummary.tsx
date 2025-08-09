'use client';
import { format, addHours } from "date-fns";
import { ar } from "date-fns/locale";
export function BookingSummary({
    date,
    time,
    duration
}: {
    date: Date | undefined;
    time: Date | undefined;
    duration: number;
}) {
    if (!date || !time) return null;

    return (
        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
            <div>
                <span className="font-medium">Date:</span> {format(date, "PPP")}
            </div>
            <div>
                <span className="font-medium">Time:</span> {format(time, "h:mm a")}
            </div>
            <div>
                <span className="font-medium">Duration:</span> {duration} hour{duration > 1 ? "s" : ""}
            </div>
            <div className="mt-1 text-xs">
                Ends at {format(addHours(time, duration), "h:mm a")}
            </div>
        </div>
    );
}