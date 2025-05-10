'use client';
import TraineeProfile from "./TraineeProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCurrentUser, useUserProfile } from "@/utils/ReactQuerySupa";
import { ProfileSkeleton } from "@/utils/Loader";

export default function ProfileClient() {
  // Fetch user data
const { data: user, isLoading: isLoadingUser, error: userError } = useCurrentUser();

// Fetch profile data based on user ID
const { 
data: profile, 
isLoading: isLoadingProfile, 
error: profileError 
} = useUserProfile(user?.id);

// Handle loading states
if (isLoadingUser || isLoadingProfile) {
return <ProfileSkeleton />;
}

// Handle errors
if (userError) {
return (
    <Alert variant="destructive" className="mt-10 max-w-md mx-auto">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Authentication Error</AlertTitle>
    <AlertDescription>
        You must be logged in to view this page.
    </AlertDescription>
    </Alert>
);
}

if (profileError || !profile) {
return (
    <Alert variant="destructive" className="mt-10 max-w-md mx-auto">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Profile Error</AlertTitle>
    <AlertDescription>
        Unable to load profile data. Please try again later.
    </AlertDescription>
    </Alert>
);
}

// Render the profile with data
return <TraineeProfile profile={{...profile, email: user?.email}} />;
}