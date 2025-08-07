"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, BarChart, Users, DollarSign} from "lucide-react";
import { Program, ProgramCategory } from "@/Types/programsType";
import { useRouter } from "next/navigation";
import { Accordion } from "@/components/ui/accordion";
import { deleteProgram } from "@/app/actions/programs";
import { useToast } from "@/hooks/use-toast";
import { ProgramHeader, DetailCard, ProgramModule } from "./prgramDetailsSUbs";
import { EditProgramDialog } from "./EditProgramDialog";
import { DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Drawer } from "../ui/drawer";
import { handleError } from "@/utils/errorHandling";
import { ProgramPayButton } from "./PayMobProgramBTN";

export default function ProgramDetails({
  program,
  isTraineeView = false
}: {
  program: Program;
  isTraineeView?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      await deleteProgram(program.id);
      toast({
        title: "Success",
        description: "Program deleted",
      });
      router.push("/trainer/programs");
    } catch (error) {
      toast({
        title: "Error",
        description: handleError(error, "Failed to delete program"),
        variant: "destructive"
      });
    }
  };

  const formatCategory = (category?: ProgramCategory) => 
    category ? category.replace("_", " ") : "Uncategorized";

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {!isTraineeView ? (
          <div className="flex gap-2 flex-wrap">
          <EditProgramDialog program={program} />
            <Drawer>
              <DrawerTrigger className="bg-red-600 p-2 rounded-md">Delete Program</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                  <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button onClick={handleDelete}>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="destructive">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <ProgramPayButton programId={program.id}/>
        )}
      </div>

      <div className="grid gap-6">
        <ProgramHeader 
          name={program.name}
          description={program.description}
          coverImageUrl={program.cover_image_url ?? ''}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DetailCard 
            icon={Calendar} 
            title="Duration" 
            value={`${program.duration_weeks} weeks`} 
          />
          <DetailCard 
            icon={BarChart} 
            title="Difficulty" 
            value={program.difficulty ? program.difficulty : "Not specified"} 
          />
          <DetailCard 
            icon={DollarSign} 
            title="Price" 
            value={`$${program.price || 0}`} 
          />
          <DetailCard 
            icon={Users} 
            title="Category" 
            value={formatCategory(program.category)} 
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Program Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {program.program_modules_v2?.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {program.program_modules_v2.map((module) => (
                  <ProgramModule key={module.id} module={module} />
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">No modules available for this program.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}