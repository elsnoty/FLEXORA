'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dumbbell,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const links = [
    { href: "/trainee/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { href: "/trainee/workouts", label: "Workouts", icon: <Dumbbell className="h-5 w-5" /> },
    { href: "/trainee/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/trainee/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

export default function SidebarTrainee() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        router.push("/error");
      }
    };
    return (
        <>
        {/* Mobile Toggle */}
        <div className="md:hidden absolute top-4 left-4 z-50">
            <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2">
                <Menu className="h-6 w-6" />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 flex flex-col justify-between">
                <div>
                <SheetHeader>
                <SheetTitle>Trainee Dashboard</SheetTitle>
                <SheetDescription></SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                {links.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium hover:text-primary"
                    >
                    {link.icon}
                    {link.label}
                    </Link>
                ))}
                </nav>
                </div>

                <Link
                    href="/auth/logout"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium text-red-500 mt-4"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Link>
            </SheetContent>
            </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:min-h-screen md:pt-4 md:mt-0 fixed top-[0] left-0 z-50 bg-background h-[calc(100vh-72px)]">
    <div className="flex flex-col justify-between h-full p-4">
        {/* Top Navigation Links */}
        <nav className="flex flex-col gap-4">
        <h1>Trainee Dashboard</h1>
        {links.map((link) => (
            <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 text-sm font-medium hover:text-primary"
            >
            {link.icon}
            {link.label}
            </Link>
        ))}
        </nav>

        {/* Bottom Logout */}
        <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-sm font-medium text-red-500"
        >
        <LogOut className="h-5 w-5" />
        Logout
        </button>
    </div>
    </aside>
        </>
    );
}
