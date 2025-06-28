"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Program } from "@/Types/programsType";
import { ProgramFormManager } from "./ProgramFormEditor";
import { useRouter } from "next/navigation";

export function EditProgramDialog({ program }: { program: Program }) {
    const router = useRouter()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Program</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Program: {program.name}</DialogTitle>
                </DialogHeader>
                <ProgramFormManager 
                    mode="edit" 
                    program={program} 
                    onSuccess={() => router.refresh()} 
                />
            </DialogContent>
        </Dialog>
    );
}