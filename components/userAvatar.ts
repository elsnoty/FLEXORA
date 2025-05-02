import { createClient } from "@/utils/supabase/server";

export default async function UserAvatarServer() {
    const supabase = await createClient() 
    const{data, error} =
    await supabase.from('profiles').select('*')

    return{
        error: error?.message,
        profiles: data
    }
}