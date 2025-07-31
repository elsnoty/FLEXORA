// trainer profile page
import ProfileLayout from "@/components/shared/ProfileLayout";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-center mt-10 text-red-500">You must be logged in.</div>;
  }
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
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return <div className="text-center mt-10 text-red-500">Profile not found.</div>;
  }

  // Combine the data into a single profile object
  const profile = {
    ...data,
    ...data.trainers?.[0], // Spread trainer data if it exists
    email: user.email
  };

  return (
    <ProfileLayout profile={profile} />
  );
}