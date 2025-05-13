import ProfileLayout from "@/components/shared/ProfileLayout";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-center mt-10 text-red-500">You must be logged in.</div>;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, user_id, name, avatar_url, bio, height, weight, location, phone_number, gender")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    return <div className="text-center mt-10 text-red-500">Profile not found.</div>;
  }
  
  return(
    <ProfileLayout profile={{...profile, email:user.email}} />
  )
}