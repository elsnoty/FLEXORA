"use client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from "lucide-react";

export function TimeDisplay({ startTime, endTime }: { startTime: string | Date; endTime: string | Date }) {
        const egyptTime = {
        start: new Date(startTime).toLocaleTimeString("en-US", {
        timeZone: "Africa/Cairo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        }),
        end: new Date(endTime).toLocaleTimeString("en-US", {
        timeZone: "Africa/Cairo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        }),
    };

    const localTime = {
        start: new Date(startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        }),
        end: new Date(endTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        }),
    };

    return (
        <div className="flex items-center gap-1">
        <span>
            {egyptTime.start} - {egyptTime.end} <span className="text-xs text-gray-500">(EET)</span>
        </span>

        <Tooltip>
            <TooltipTrigger>
            <Clock className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
            <p>Your local time: {localTime.start} - {localTime.end}</p>
            </TooltipContent>
        </Tooltip>
        </div>
    );
}