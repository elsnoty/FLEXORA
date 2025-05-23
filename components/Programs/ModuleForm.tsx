"use client";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleFormValues } from "../../utils/validation/Programschemas";

interface ModuleFormProps {
  form: UseFormReturn<ModuleFormValues>;
  onSubmit: (data: ModuleFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ModuleForm({ form, onSubmit, isSubmitting }: ModuleFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.watch("modules").map((_, index) => (
          <Card key={index} className="p-4">
            <CardHeader>
              <CardTitle>Module {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`modules.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter module title" {...field} />
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
              const modules = form.getValues("modules");
              form.setValue("modules", [
                ...modules,
                { title: "", description: "", order_index: modules.length }
              ]);
            }}
          >
            Add Module
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Next: Add Content"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 