import ProgramsPreview from "@/components/Programs/ProgramsPreview";
import { getCurrentUserPrograms } from "@/utils/supabase/program-queries";

export default async function ProgramsPagePreview() {
  const programs = await getCurrentUserPrograms();
  return <ProgramsPreview programs={programs} />;
}