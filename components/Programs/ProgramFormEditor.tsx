"use client";
import { useState } from "react";
import { ProgramDetailsForm } from "./ProgramDetailsForm";
import { ModuleForm } from "./ModuleForm";
import { useToast } from "@/hooks/use-toast";
import { createModules, createProgram, updateProgram, updateModules } from "@/app/actions/programs";
import { useProgramForms } from "@/hooks/useProgramForms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Program } from "@/Types/programsType";
import { ProgramFormValues,ModuleFormValues  } from "@/utils/validation/Programschemas";

interface ProgramFormManagerProps {
  mode: "create" | "edit";
  program?: Program;
  onSuccess?: () => void;
}

export function ProgramFormManager({ mode, program, onSuccess }: ProgramFormManagerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("program");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ ,setCurrentProgram] = useState(program);
  const [programId, setProgramId] = useState<string | null>(program?.id ?? null);

  const { programForm, moduleForm } = useProgramForms(mode, program);

  const handleProgramSubmit = async (data: ProgramFormValues) => {
    try {
      setIsSubmitting(true);
      if (mode === "create") {
        const newProgram = await createProgram(data);
        setProgramId(newProgram.id);
        toast({ title: "Success", description: "Program created! Now add modules." });
      } else {
        const updated = await updateProgram(program!.id, data);
        if (updated) {
          setCurrentProgram(updated);
          toast({ title: "Success", description: "Program details updated!" });
        }
      }
      setActiveTab("modules");
    } catch (error) {
      console.error("Program update error:", error);
      toast({
        title: "Error",
        description: `Failed to ${mode === "create" ? "create" : "update"} program`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModulesSubmit = async (data: ModuleFormValues) => {
    if (!programId) return;
    try {
      setIsSubmitting(true);
      if (mode === "create") {
        await createModules(programId, data);
        toast({ title: "Success", description: "Program created successfully!" });
      } else {
        const updated = await updateModules(programId, data);
        if (updated) {
          setCurrentProgram(updated);
          toast({ title: "Success", description: "Program updated successfully!" });
        }
      }
      onSuccess?.();
      if (mode === "create") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Modules update error:", error);
      toast({
        title: "Error",
        description: `Failed to ${mode === "create" ? "create" : "update"} program`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="modules" disabled={!programId}>Modules</TabsTrigger>
      </TabsList>

      <TabsContent value="program">
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <ProgramDetailsForm form={programForm} onSubmit={handleProgramSubmit} isSubmitting={isSubmitting} mode={mode}/>
        </div>
      </TabsContent>

      <TabsContent value="modules">
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <ModuleForm form={moduleForm} onSubmit={handleModulesSubmit} isSubmitting={isSubmitting} mode={mode} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
