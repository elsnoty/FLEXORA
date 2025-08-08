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
        <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:min-h-screen md:pt-4 md:mt-0 fixed top-[-10px] left-0 z-50 bg-background h-[calc(100vh+10px)]">
    <div className="flex flex-col justify-between h-full p-4">
        {/* Top Navigation Links */}
        <nav className="flex flex-col gap-4">
        <Link href="/">
            <Image
                src={Logo}
                alt="Flexora Logo"
                width={120}
                height={120}
            />
                </Link>
          {renderLinks()}
        </nav>

        {/* Bottom Logout */}
        <LogoutButtonMenu onClick={handleLogout}/>    
    </div>
    </aside>
        </>
    );
}