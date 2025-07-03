import { User, Dumbbell, MessageSquare, Users, CalendarCheck } from "lucide-react";
import UserAvatarServer from "../../app/actions/userAvatar";

export async function GetTrainerSideLinks() {
    const { profiles, error } = await UserAvatarServer();
    const ownProfile = profiles?.find(profile =>profile.role === 'trainer') || null;

    if (error) {
        throw new Error(error);
    }

    if (!ownProfile) {
        throw new Error('No profile found');
    }

    return [
        { href: "/trainer/clients", label: "Clients", icon: <Users className="h-5 w-5" /> },
        { href: "/trainer/sessions", label: "Sessions", icon: <CalendarCheck  className="h-5 w-5" /> },
        { href: "/trainer/programs", label: "Training Programs", icon: <Dumbbell className="h-5 w-5" /> },
        { href: "/trainer/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
        { href: `/${ownProfile.role}/profile/${ownProfile.id}`, label: "Profile", icon: <User className="h-5 w-5" /> },
    ];
}