"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BillingFormData, billingSchema } from "@/utils/validation/biling";

export function BillingInfoSheet({ userId }: { userId: string }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<BillingFormData>({
        resolver: zodResolver(billingSchema),
        defaultValues: async () => {
        // Pre-fill existing data if available
        const { data } = await supabase
            .from("billing_info")
            .select("*")
            .eq("user_id", userId)
            .single();
        
        return {
            first_name: data?.first_name || "",
            last_name: data?.last_name || "",
            email: data?.email || "",
            phone_number: data?.phone_number || "",
            country: data?.country || "",
            city: data?.city || "",
        };
        }
    });

    async function onSubmit(data: BillingFormData) {
        try {
        const { error } = await supabase
            .from("billing_info")
            .upsert({
            user_id: userId,
            ...data,
            updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;

        toast({
            title: "Success!",
            description: "Billing information saved",
        });
        setOpen(false);
        router.refresh();
        } catch (error) {
        toast({
            title: "Error",
            description: "Failed to save billing information",
            variant: "destructive",
        });
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
            <Button variant="outline">Updata Billing Info</Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[500px]">
            <SheetHeader>
            <SheetTitle>Billing Information</SheetTitle>
            </SheetHeader>
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="w-full"
                >
                {form.formState.isSubmitting ? "Saving..." : "Save Information"}
                </Button>
            </form>
            </Form>
        </SheetContent>
        </Sheet>
    );
}