"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramDetailsForm } from "./ProgramDetailsForm";
import { ModuleForm } from "./ModuleForm";
import { ContentForm} from "./ContentForm";
import { programSchema, moduleSchema, contentSchema, type ProgramFormValues, type ModuleFormValues,
type ContentFormValues } from "../../utils/validation/Programschemas";
import { useToast } from "@/hooks/use-toast";
import { createContent, createModules, createProgram } from "@/app/actions/programs";

interface CreateProgramFormProps {
  onSuccess?: () => void;
}

export function CreateProgramForm({ onSuccess }: CreateProgramFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programId, setProgramId] = useState<string | null>(null);
  const [moduleIds, setModuleIds] = useState<string[]>([]);
  const {toast} = useToast();

  const programForm = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
      duration_weeks: 4,
      price: 0,
      category: "muscle_gain",
      difficulty: "beginner",
      is_public: false,
    },
  });

  const moduleForm = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      modules: [{ title: "", description: "", order_index: 0 }]
    }
  });

  const contentForm = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      moduleContents: []
    }
  });

  // Step 1: Create Program
  const onProgramSubmit = async (data: ProgramFormValues) => {
    try {
      setIsSubmitting(true);
      const program = await createProgram(data);
      setProgramId(program.id);
      setCurrentStep(2);
      toast({
        title: "Success",
        description: "Program created! Now add modules.",
      });
    } catch (error) {
      console.error(error); 
    } finally {
      setIsSubmitting(false); 
    }
  };

  // Step 2: Create Modules
  const onModuleSubmit = async (data: ModuleFormValues) => {
    if (!programId) return;
    
    try {
      setIsSubmitting(true);
      const { moduleIds } = await createModules(programId, data);
      setModuleIds(moduleIds);
      contentForm.reset({
        moduleContents: moduleIds.map((moduleId: string) => ({
          module_id: moduleId,
          content_type: "video",
          content_url: "",
          title: "",
          description: "",
          duration_minutes: undefined
        }))
      });
      setCurrentStep(3);
      toast({
        title: "Success",
        description: "Modules created! Now add content.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Create Content
  const onContentSubmit = async (data: ContentFormValues) => {
    if (!programId || moduleIds.length === 0) return;
    
    try {
      setIsSubmitting(true);
      await createContent(data);
      toast({
        title: "Success",
        description: "Program created successfully!",
      });
      onSuccess?.();
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex items-center ${step !== 3 ? "flex-1" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {step}
            </div>
            {step !== 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <ProgramDetailsForm
          form={programForm}
          onSubmit={onProgramSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 2 && (
        <ModuleForm
          form={moduleForm}
          onSubmit={onModuleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 3 && (
        <ContentForm
          form={contentForm}
          onSubmit={onContentSubmit}
          isSubmitting={isSubmitting}
          moduleIds={moduleIds}
        />
      )}
    </div>
  );
} 