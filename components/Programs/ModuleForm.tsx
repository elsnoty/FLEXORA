"use client";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleFormValues } from "../../utils/validation/Programschemas";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModuleFormProps {
  form: UseFormReturn<ModuleFormValues>;
  onSubmit: (data: ModuleFormValues) => Promise<void>;
  isSubmitting: boolean;
  mode?: 'create' | 'edit';
}

export function ModuleForm({ form, onSubmit, isSubmitting, mode }: ModuleFormProps) {
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
              {/* Module Fields */}
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

              {/* Content Fields */}
              <FormField
                control={form.control}
                name={`modules.${index}.content_type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="meal_plan">Meal Plan</SelectItem>
                        <SelectItem value="workout">Workout</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`modules.${index}.content_title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter content title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`modules.${index}.content_description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter content description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`modules.${index}.content_url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter content URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`modules.${index}.duration_minutes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Enter duration in minutes"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
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
                { 
                  title: "", 
                  description: "", 
                  order_index: modules.length,
                  content_type: "video",
                  content_title: "",
                  content_description: "",
                  content_url: "",
                  duration_minutes: null
                }
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
            {isSubmitting ? "Saving..." : mode === "create" ? "Complete Program" : "Update Program"}
          </Button>
        </div>
      </form>
    </Form>
  );
}