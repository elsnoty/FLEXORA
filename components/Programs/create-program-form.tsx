"use client";
import { useState } from "react";
import { ProgramDetailsForm } from "./ProgramDetailsForm";
import { ModuleForm } from "./ModuleForm";
import { useToast } from "@/hooks/use-toast";
import { createModules, createProgram } from "@/app/actions/programs";
import { useProgramForms } from "@/hooks/useProgramForms";
import { ProgramFormValues, ModuleFormValues } from "@/utils/validation/Programschemas";
import { useRouter } from "next/navigation";
import { handleError } from "@/utils/errorHandling";

interface CreateProgramFormProps {
  onSuccess?: () => void;
}

export function CreateProgramForm({ onSuccess }: CreateProgramFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programId, setProgramId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { programForm, moduleForm } = useProgramForms("create");

  const onProgramSubmit = async (data: ProgramFormValues) => {
    try {
      setIsSubmitting(true);
      const program = await createProgram(data);
      
      setProgramId(program.id);
      setCurrentStep(2);
      toast({ title: "Success", description: "Program created! Now add modules." });
    } catch (error) {
      toast({ 
        title: "Error",
        description: handleError(error, "Failed to create program"),
        variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onModuleSubmit = async (data: ModuleFormValues) => {
    if (!programId) return;
    try {
      setIsSubmitting(true);
      await createModules(programId, data);
      
      toast({ title: "Success", description: "Program created successfully!" });
      onSuccess?.();
      router.refresh(); 
    } catch (error) {
      toast({ 
        title: "Error",
        description: handleError(error, "Failed to create Modules"),
        variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        {[1, 2].map((step) => (
          <div key={step} className={`flex items-center ${step !== 2 ? "flex-1" : ""}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {step}
            </div>
            {step !== 2 && (
              <div className={`flex-1 h-1 mx-2 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <ProgramDetailsForm form={programForm} onSubmit={onProgramSubmit} isSubmitting={isSubmitting} mode="create"/>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <ModuleForm form={moduleForm} onSubmit={onModuleSubmit} isSubmitting={isSubmitting} />
        </div>
      )}
    </div>
  );
}