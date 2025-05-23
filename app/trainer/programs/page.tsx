"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dumbbell, Calendar, BarChart, Plus } from "lucide-react";
import { CreateProgramForm } from "./create-program-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProgramsLoader } from "@/utils/ProgramsLoader";
import { Program } from "@/Types/programsType";
import { programApi } from "@/lib/axiosProgram";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {toast} = useToast();
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await programApi.getAll();
        setPrograms(response.data); 

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load programs",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrograms();
  }, []);

if (error) {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading programs</h1>
        <p className="text-red-500 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    </div>
  );
}
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Training Programs</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
            <CreateProgramForm />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <ProgramsLoader />
      ) : programs.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No programs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new training program.
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Program
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const router = useRouter();
  const formattedCategory = program.category ? program.category.replace("_", " ") : "Uncategorized";

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        {program.cover_image_url ? (
          <img
            src={program.cover_image_url}
            alt={program.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <Dumbbell className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <span className="inline-block px-2 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium">
            {formattedCategory}
          </span>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{program.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {program.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{program.duration_weeks} weeks</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BarChart className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{program.difficulty}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-lg">${program.price}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/trainer/programs/${program.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}