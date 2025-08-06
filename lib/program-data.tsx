// lib/program-data.ts
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getProgramDetails = cache(async (id: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('training_programs')
        .select(`...your_fields...`)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
});