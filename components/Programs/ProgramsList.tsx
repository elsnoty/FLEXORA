import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dumbbell, Calendar, BarChart } from "lucide-react";
import { Program } from "@/Types/programsType";
import Link from "next/link";
import {CreateProgramDialog} from "./CreateProgramDialog";
import Image from "next/image";
import { ProgramPayButton } from "./PayMobProgramBTN";

export default function ProgramsList({ programs }: { programs: Program[] }) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Training Programs</h1>
        <CreateProgramDialog />
      </div>

      {programs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} isTrainee={false}/>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No programs</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new training program.
      </p>
      <div className="mt-6">
        <CreateProgramDialog />
      </div>
    </div>
  );
}


export function ProgramCard({ program, isTrainee }: { program: Program, isTrainee?: boolean }) {
  const formattedCategory = program.category ? program.category.replace("_", " ") : "Uncategorized";

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        {program.cover_image_url ? (
          <Image
          src={program.cover_image_url}
          alt={program.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-md"
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
          <div className="flex items-center gap-2">
            <Link href={isTrainee 
              ? `/trainee/programs/${program.id}`
              : `/trainer/programs/${program.id}`
            }>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            {isTrainee && (
              <ProgramPayButton programId={program.id}/>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}