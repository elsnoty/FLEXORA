import { User, Dumbbell, MessageSquare, BarChart } from "lucide-react";
import UserAvatarServer from "../userAvatar";

export async function GetTraineeSideLinks() {
    const { profiles, error } = await UserAvatarServer();
    const ownProfile = profiles?.find(profile => profile.role === 'trainee') || null;

    if (error) {
        throw new Error(error);
    }
 
    if (!ownProfile) {
        throw new Error('No profile found');
    }

    return [
        { href: "/trainee/progress", label: "Progress", icon: <BarChart className="h-5 w-5" /> },
        { href: "/trainee/workouts", label: "Workouts", icon: <Dumbbell className="h-5 w-5" /> },
        { href: "/trainee/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
        { href: `/${ownProfile.role}/profile/${ownProfile.id}`, label: "Profile", icon: <User className="h-5 w-5" /> },
    ];
}