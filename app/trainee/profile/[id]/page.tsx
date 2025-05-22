import { createClient } from "@/utils/supabase/server";
import ProfileLayout from "@/components/shared/ProfileLayout";
import { notFound } from "next/navigation";

export default async function TraineeProfilePageView({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-center mt-10 text-red-500">You must be logged in.</div>;
  }
  params.id = user.id;
  // Fetch profile and trainer data in a single query
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *
    `)
    .eq("user_id", params.id)
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