import { createClient } from "@/utils/supabase/server";
import ProfileLayout from "@/components/shared/ProfileLayout";
import { notFound } from "next/navigation";
import { getTraineeMetadata } from "@/lib/trainee-metadata";

export async function generateMetadata() {
  return getTraineeMetadata({
    title: `Profile`,
    description: `Fitness progress and achievements`,
    fallbackTitle: 'Trainee Profile'
  });
}

export default async function TraineeProfilePageView() {
  const supabase = await createClient();
const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-center mt-10 text-red-500">You must be logged in.</div>;
  }
  // Fetch profile and trainer data in a single query
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *
    `)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  // Combine the data into a single profile object
  const profile = {
    ...data,
    email: user.email,
  };

  return (
    <div className="">
      <ProfileLayout profile={profile} isEditable={true}/>
    </div>
  );
} 