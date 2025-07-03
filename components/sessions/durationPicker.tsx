'use client';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const durationOptions = [
    { value: 1, label: "1 hour" },
    { value: 1.5, label: "1.5 hours" },
    { value: 2, label: "2 hours" },
];

export function DurationPicker({
    value,
    onChange
    }: {
    value: number;
    onChange: (value: number) => void;
    }) {
    return (
        <div>
        <div className="text-sm font-medium mb-2">Duration</div>
        <Select
            value={value.toString()}
            onValueChange={(v) => onChange(parseFloat(v))}
        >
            <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
            {durationOptions.map((option) => (
                <SelectItem key={option.value.toString()} value={option.value.toString()}>
                {option.label}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </div>
    );
}