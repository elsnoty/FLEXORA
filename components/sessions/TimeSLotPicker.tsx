// components/TimeSlotPicker.tsx
'use client';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Clock } from "lucide-react";
import { format } from "date-fns";

const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        slots.push({
            value: time,
            label: format(time, "h:mm a"),
        });
        }
    }
    return slots;
};

export function TimeSlotPicker({
    value,
    onChange
    }: {
    value: Date | undefined;
    onChange: (value: Date | undefined) => void;
    }) {
    const timeSlots = generateTimeSlots();

    return (
        <div>
        <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pick a Time
        </div>
        <Select
            value={value?.toISOString()}
            onValueChange={(v) => onChange(v ? new Date(v) : undefined)}
        >
            <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
            {timeSlots.map((slot) => (
                <SelectItem key={slot.value.toISOString()} value={slot.value.toISOString()}>
                {slot.label}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </div>
    );
}