'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { CreateProgramForm } from "./create-program-form";
import { Plus } from "lucide-react";

export function CreateProgramDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Program
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Training Program</DialogTitle>
        </DialogHeader>
        <CreateProgramForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}