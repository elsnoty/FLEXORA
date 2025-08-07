import TrainerSessionView from "@/components/sessions/TrainerSessionView";
import { getUserMetadata } from "@/lib/user-metadata";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export async function generateMetadata() {
    return getUserMetadata({
        title: 'Training Sessions',
        description: 'Manage your upcoming training sessions',
        role: 'trainer',
        fallbackTitle: 'Coach Portal'
        });
    }
    
export default async function TrainerSessionsPage() {
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) return notFound();

const { data: sessions, error } = await supabase
.from("trainer_sessions_view")
.select("*")
.eq("trainer_id", user.id)
.order("start_time", { ascending: true });

if (error) {
console.error("Error fetching sessions:", error);
return <div className="text-red-500">Error loading sessions</div>;
}

if (!sessions || sessions.length === 0) {
return <div className="text-muted-foreground italic">No sessions booked yet.</div>;
}

return (
    <TrainerSessionView  sessions={sessions}/>
);
}