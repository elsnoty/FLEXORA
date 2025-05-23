"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, BarChart, Users, DollarSign, Dumbbell, Play, FileText, Clock } from "lucide-react";
import { programApi } from "@/lib/axiosProgram";
import { Program, ContentType, ProgramCategory, BaseModule } from "@/Types/programsType";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Use the existing Program type and extend it
type ProgramWithModules = Program & {
  program_modules: BaseModule[];
};

export default function ProgramDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramWithModules | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const {toast} = useToast();
  
  useEffect(() => {
    async function fetchProgramDetails() {
    try {
    const { data } = await programApi.getById(params.id as string);
    if (!data) throw new Error("Program not found");
    setProgram(data);
    console.log(data);
    } catch (err) {
    setError(err as Error);
    toast({
      title: "Error",
      description: "Failed to load program details",
    });
    } finally {
    setIsLoading(false);
    }
    }
    fetchProgramDetails()
  }, [params.id]);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading program</h1>
          <p className="text-red-500 mb-4">{error.message}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program not found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const renderContentIcon = (contentType: ContentType) => {
    switch (contentType) {
      case "video":
        return <Play className="h-4 w-4 text-muted-foreground" />;
      case "document":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "meal_plan":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "workout":
        return <Dumbbell className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatCategory = (category: ProgramCategory | undefined) => {
    if (!category) return "Uncategorized";
    return category.replace("_", " ");
  };

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Programs
      </Button>

      <div className="grid gap-6">
        {/* Program Header */}
        <div className="relative h-64 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          {program.cover_image_url ? (
            <img
              src={program.cover_image_url}
              alt={program.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <Dumbbell className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{program.name}</h1>
            <p className="text-lg opacity-90">{program.description}</p>
          </div>
        </div>

        {/* Program Details */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{program.duration_weeks} weeks</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold capitalize">
                  {program.difficulty || "Not specified"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">${program.price || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold capitalize">
                  {formatCategory(program.category)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Program Modules Section */}
        <Card>
          <CardHeader>
            <CardTitle>Program Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {program.program_modules && program.program_modules.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {program.program_modules.map((module) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{module.description || "No description available"}</p>
                        {module.module_content && module.module_content.length > 0 ? (
                          <div className="space-y-2">
                            {module.module_content.map((content) => (
                              <Card key={content.id} className="bg-muted/50">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      {renderContentIcon(content.content_type)}
                                      <div>
                                        <h4 className="font-medium">{content.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {content.description || "No description available"}
                                        </p>
                                      </div>
                                    </div>
                                    {content.duration_minutes && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{content.duration_minutes} min</span>
                                      </div>
                                    )}
                                  </div>
                                  {content.content_url && (
                                    <div className="mt-3">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => window.open(content.content_url, "_blank")}
                                      >
                                        {content.content_type === "video" ? "Watch" : "View"} Content
                                      </Button>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No content available for this module.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
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
