//trainee/suggestion/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProfileLayout from "@/components/shared/ProfileLayout";
import { notFound } from "next/navigation";
import { getProgramsForCurrentTrainer } from "@/lib/data/programsFetch";
import { ProgramCard } from "@/components/Programs/ProgramsList";
import BookSessionDialog from "@/components/sessions/BookSessionDialog";
export const dynamic = 'force-dynamic'; // for fresh data

export default async function TrainerProfilePageView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {id} = await params
  const trainerId = id;

  // Fetch trainer's programs
  const programs = await getProgramsForCurrentTrainer(trainerId);

  // Fetch trainer profile and extra details
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
    .eq("user_id", trainerId)
    .single();

  if (error || !data || !data.trainers?.[0]) {
    notFound();
  }

  const profile = {
    ...data,
    ...data.trainers[0],
  };
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10">
      <ProfileLayout profile={profile} isEditable={false} />
      <BookSessionDialog trainerId={trainerId}/>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Training Programs</h2>

        {programs.length === 0 ? (
          <div className="text-gray-500 italic">This trainer hasn't added any programs yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} isTrainee={true} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
