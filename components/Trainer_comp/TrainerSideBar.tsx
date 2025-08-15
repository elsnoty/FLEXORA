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
    ArrowLeft,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useState } from "react";
import { SidebarLink } from "@/Types/SideBarLinks";
import Logo from "@/public/Flexora-LogoV3.png"
import Image from "next/image";
import LogoutButtonMenu from "../shared/LogoutButtonMenu";

interface SidebarTraineeProps {
    links: SidebarLink[];
    }

export default function SidebarTrainee({ links }: SidebarTraineeProps) {
    const [open, setOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch("/api/logout", { method: "POST" });
        if (res.ok) {
            router.push("/login");
        } else {
            router.push("/error");
        }
    };
    const renderLinks = () => (
        <>
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
        </>
    );
    return (
        <>
        {/* Mobile Toggle */}
        <div className="md:hidden absolute top-4 left-4 z-50">
            <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 fixed top-4 left-4">
                <Menu className="h-6 w-6" />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 flex flex-col justify-between">
                <div>
                <SheetHeader>
                <Link href="/">
                <SheetTitle>
                    <Image
                        src={Logo}
                        alt="Flexora Logo"
                        width={120}
                        height={120}
                    />
                </SheetTitle>
                </Link>
                <SheetDescription></SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                {renderLinks()}
                </nav>
                </div>
                <LogoutButtonMenu onClick={handleLogout}/>    
            </SheetContent>
            </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block relative">
            <aside
            className={`md:flex md:w-64 md:flex-col md:min-h-screen md:pt-4 md:mt-0 fixed top-[-10px] left-0 z-40 bg-background h-[calc(100vh+10px)] transition-transform duration-300 ease-in-out ${
                desktopSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            >
            <div className="flex flex-col justify-between h-full p-4">
                <nav className="flex flex-col gap-4">
                    <div className="relative flex items-center">

                <Link href="/">
                    <Image
                    src={Logo}
                    alt="Flexora Logo"
                    width={120}
                    height={120}
                    className="transition-transform duration-300 hover:scale-105"
                    />
                </Link>
                <button
                    className="p-2 absolute top-0 -right-14 z-50 rounded-md hover:bg-accent transition-all duration-200"
                    onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                    >
                    <ArrowLeft className={`h-5 w-5 transition-transform duration-200 ${desktopSidebarOpen ? '' : 'rotate-180'}`} />
                </button>
                    </div>
                {renderLinks()}
                </nav>
                <div className="relative items-center">
                <LogoutButtonMenu onClick={handleLogout} />
                </div>
            </div>
            </aside>
        </div>
        </>
    );
}