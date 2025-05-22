'/profile/suggestion/[id]'
import { createClient } from "@/utils/supabase/server";
import ProfileLayout from "@/components/shared/ProfileLayout";
import { notFound } from "next/navigation";

export default async function TrainerProfilePageView({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch profile and trainer data in a single query
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      trainers (
        specialization,
        hourly_rate,
        is_active
      )
    `)
    .eq("user_id", params.id)
    .single();

  if (error || !data || !data.trainers?.[0]) {
    notFound();
  }

  // Combine the data into a single profile object
  const profile = {
    ...data,
    ...data.trainers[0], 
  };

  return (
    <div className="">
      <ProfileLayout profile={profile} isEditable={false} />
    </div>
  );
} 