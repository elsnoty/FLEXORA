'use server'
import { ProfileAvatarH } from "@/Types/userAavatar";
import { createClient } from "@/utils/supabase/server";

export default async function UserAvatarServer(): Promise<{
    error: string | undefined;
    profiles: ProfileAvatarH[] | null;
}> {
    const supabase = await createClient() 
    const {
        data: { user },
      } = await supabase.auth.getUser();
    
    const{data, error} =
    await supabase.from('profiles').select('id, avatar_url, name, role').eq('user_id', user?.id)

    return{
        error: error?.message,
        profiles: data
    }
}