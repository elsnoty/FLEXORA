import UserAvatarServer from "@/components/userAvatar";
import { createClient } from "@/utils/supabase/client";
import { ToggleTheme } from "@/utils/toggle-theme";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { log } from "console";
import { useCallback } from "react";

export default async function TranineePage(){
    const {profiles}= await UserAvatarServer()
    log(profiles)
    return(
        <div className="w-screen h-screen">
            <p>
            Trainee page
            </p>
            
            <ToggleTheme />
            {
                profiles?.map(pro =>(
                    <div key={pro.id}>
                    <p>{pro.name}</p>
                    <Avatar>
                        <AvatarImage src={pro.avatar_url} className="rounded-full" width={60} height={60}/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    
                </div>
                ))
            }
        </div>
    )
}