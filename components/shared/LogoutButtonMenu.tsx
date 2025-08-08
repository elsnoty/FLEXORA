'use client';
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
    onClick: () => void;
    className?: string; 
}

export default function LogoutButtonMenu({ onClick, className = "" }: LogoutButtonProps) {
    return (
        <button
        onClick={onClick}
        className={`flex items-center gap-3 text-sm font-medium text-red-500 ${className}`}
        >
        <LogOut className="h-5 w-5" />
        Logout
        </button>
    );
}
