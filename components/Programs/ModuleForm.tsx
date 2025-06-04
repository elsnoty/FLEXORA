"use client";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleFormValues } from "../../utils/validation/Programschemas";
import { Trash2 } from "lucide-react";

interface ModuleFormProps {
  form: UseFormReturn<ModuleFormValues>;
  onSubmit: (data: ModuleFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ModuleForm({ form, onSubmit, isSubmitting }: ModuleFormProps) {
  const modules = form.watch("modules");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {modules.map((_, index) => (
          <Card key={index} className="p-4 relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Module {index + 1}</span>
                {modules.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      form.setValue(
                        "modules",
                        modules.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`modules.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter module title" 
                        {...field} 
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`modules.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter module description"
                        className="min-h-[100px]"
                        {...field}
                        maxLength={500}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`modules.${index}.order_index`}
                render={({ field }) => (
                  <input type="hidden" {...field} value={index} />
                )}
              />
            </CardContent>
          </Card>
        ))}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.setValue("modules", [
                ...modules,
                { title: "", description: "", order_index: modules.length }
              ]);
            }}
          >
            Add Module
          </Button>
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={isSubmitting || modules.some(m => !m.title)}
          >
            {isSubmitting ? "Creating..." : "Next: Add Content"}
          </Button>
        </div>
      </form>
    </Form>
  );
}