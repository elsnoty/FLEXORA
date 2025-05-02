"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { SelectRoleSchema } from "@/utils/validation/SelecTRole";

type ActionResponse = { error: string | null };

export async function selectRoleAction(formData: FormData): Promise<ActionResponse> {
    const data = {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        gender:formData.get("gender") as string
    };

    const validationResult = SelectRoleSchema.safeParse(data);
    
    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || "Invalid form data";
        return { error: errorMessage };
    }
    
    const { name, role, gender } = validationResult.data;

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "User not found" };
    }

    // Update the user's profile with the selected role and name
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ user_id: user.id, role, name, gender })
        .eq("user_id", user.id);

    if (profileError) {
        return { error: "Failed to update profile: " + profileError.message };
    }

    revalidatePath("/", "layout");

    if (role === "trainer") {
        redirect("/dashboard/trainer");
    } else if (role === "trainee") {
        redirect("/dashboard/trainee");
    }

    return { error: null };
}