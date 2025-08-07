import { createClient } from "@/utils/supabase/server";
import ProfileLayout from "@/components/shared/ProfileLayout";
import { notFound } from "next/navigation";
import { getUserMetadata } from "@/lib/user-metadata";
import { BillingInfoSheet } from "@/components/Trainee_comp/BilingInfoSheet";
import BillingInfoCard from "@/components/Trainee_comp/BillingInfoCard";

export async function generateMetadata() {
  return getUserMetadata({
    title: `my name`,
    description: `Flexora Fitness progress and achievements`,
    fallbackTitle: 'Trainee Profile',
    showName: true,
    role:'trainee'
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
    
    const { data: billingInfo } = await supabase
    .from("billing_info")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  // Combine the data into a single profile object
  const profile = {
    ...data,
    email: user.email,
    hasBillingInfo: !!billingInfo
  };

  return (
    <div className="">
      <ProfileLayout profile={profile} isEditable={true} />
      <BillingInfoCard userId={user.id} billingInfo={billingInfo} />
    </div>
  );
} 