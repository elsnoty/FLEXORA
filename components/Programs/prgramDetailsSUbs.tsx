import { ProgramModule as ProgramModuleType } from "@/Types/programsType";
import { Dumbbell, Play, FileText, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Image from "next/image";

export const ProgramHeader = ({ 
  name, 
  description, 
  coverImageUrl 
}: {
  name: string;
  description: string;
  coverImageUrl?: string;
}) => (
  <div className="relative h-64 rounded-lg overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
    {coverImageUrl ? (
      <Image 
        src={coverImageUrl} 
        alt={name} 
        className="h-full w-full object-cover"
        fill
      />
    ) : (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <Dumbbell className="h-16 w-16 text-gray-400" />
      </div>
    )}
    <div className="absolute bottom-0 left-0 p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <p className="text-lg opacity-90">{description}</p>
    </div>
  </div>
);

export const DetailCard = ({ 
  icon: Icon, 
  title, 
  value 
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </CardContent>
  </Card>
);

export const ProgramModule = ({ module }: { module: ProgramModuleType }) => {
  const renderContentIcon = (contentType?: string) => {
    const icons = {
      video: Play,
      document: FileText,
      meal_plan: FileText,
      workout: Dumbbell,
    };
    const Icon = contentType && icons[contentType as keyof typeof icons] || FileText;
    return <Icon className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="bg-muted/40 border border-border rounded-2xl shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-primary">{module.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {module.description || "No description available"}
          </p>
        </div>

        {module.content_type ? (
          <div className="space-y-3">
            <div className="flex justify-between items-start bg-background p-4 rounded-xl border">
              <div className="flex items-start gap-3">
                {renderContentIcon(module.content_type)}
                <div>
                  <h4 className="font-medium text-base">
                    {module.content_title || "Untitled Content"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {module.content_description || "No description available"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {module.duration_minutes && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration_minutes} Min</span>
                  </div>
                )}
                {module.content_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(module.content_url!, "_blank")}
                  >
                    {module.content_type === "video" ? "Watch" : "View"} Content
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No Content For This Module.</p>
        )}
      </CardContent>
    </Card>
  );
};