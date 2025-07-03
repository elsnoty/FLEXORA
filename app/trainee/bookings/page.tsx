// app/trainee/bookings/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingSessions } from "@/Types/Sessions";

export default async function TraineeBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("trainee_bookings_view")
    .select(`*`)
    .eq("trainee_id", user.id)
    .order("start_time", { ascending: false });
  const typedSessions = sessions as BookingSessions[] | null;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Booking Requests</h1>
      
      {typedSessions?.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet</p>
      ) : (
        <div className="space-y-3">
          {typedSessions?.map((session) => (
            <Card key={session.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={session.trainer_avatar || "/default-avatar.jpg"} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3>{session.trainer_name}</h3>
                  </div>
                </div>
                <Badge variant={
                  session.status === 'accepted' ? 'default' :
                  session.status === 'rejected' ? 'destructive' : 'outline'
                }>
                  {session.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{new Date(session.start_time).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p>
                      {new Date(session.start_time).toLocaleTimeString()} - 
                      {new Date(session.end_time).toLocaleTimeString()}
                    </p>
                  </div>
                  {session.status === 'rejected' && (
                    <div>
                      <p className="text-sm text-muted-foreground">Reason</p>
                      <p>{session.rejection_reason || "Not specified"}</p>
                    </div>
                  )}
                </div>
                {session.status === 'accepted' && (
                  <Button className="mt-4" >
                    Proceed to Payment
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}