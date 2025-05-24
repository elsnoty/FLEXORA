import { notFound } from "next/navigation";
import ProgramDetails from "@/components/Programs/ProgramDetailsView";
import { getFullProgramPreview } from "@/utils/supabase/program-queries";
export const dynamic = 'force-dynamic'; // for always fresh data

export default async function ProgramPageDetails({params}: {params: {id: string}}) {
  const { id } = await params;
  try {
    const program = await getFullProgramPreview(id);
    return <ProgramDetails program={program} />;
  } catch (error) {
    console.error("Error fetching program:", error);
    notFound();
  }
}
