'use server'
import { Profile } from "@/Types/userAavatar";
import { createClient } from "@/utils/supabase/server";

export default async function UserAvatarServer(): Promise<{
    error: string | undefined;
    profiles: Profile[] | null;
}> {
    const supabase = await createClient() 
    const{data, error} =
    await supabase.from('profiles').select('id, avatar_url, name')

    return{
        error: error?.message,
        profiles: data
    }
}