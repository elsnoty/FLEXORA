// app/trainee/bookings/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingSessions } from "@/Types/Sessions";
import { PayButton } from "./PayMobSessionBTN";
import Image from "next/image";
import { CalendarDays, Clock, Info } from "lucide-react";
import { getUserMetadata } from "@/lib/user-metadata";

export async function generateMetadata() {
  return getUserMetadata({
    title: 'Training Bookings',
    description: 'Manage your session appointments',
    role:'trainee',
    fallbackTitle: 'My Bookings',
  });
}

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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Your Booking Requests</h1>
      
      {typedSessions && typedSessions.length === 0 ? (
          <p className="text-muted-foreground text-lg">You haven&apos;t booked any sessions yet.</p>
          ) : typedSessions && (
            <div className="space-y-4">
              {typedSessions.map((session) => (
            <Card key={session.id} className="shadow-md rounded-2xl border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <div className="flex items-center gap-3">
                  <Image
                    width={40}
                    height={40}
                    alt="trainer avatar"
                    src={session.trainer_avatar || "/default-avatar.jpg"}
                    className="rounded-full border object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-base">{session.trainer_name}</h3>
                    <p className="text-sm text-muted-foreground">Trainer</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Badge variant={
                    session.status === 'accepted' ? 'default' :
                    session.status === 'rejected' ? 'destructive' : 'outline'
                  }>
                    {session.status}
                  </Badge>
                  {session.payment_status && (
                    <Badge variant={
                      session.payment_status === 'paid' ? 'default' :
                      session.payment_status === 'unpaid' ? 'secondary' : 'outline'
                    }>
                      {session.payment_status}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 border-t space-y-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>
                      <span className="text-muted-foreground">Date: </span>
                      {new Date(session.start_time).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                      {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {session.status === "rejected" && (
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <span className="text-muted-foreground">Reason: </span>
                        {session.rejection_reason || "Not specified"}
                      </span>
                    </div>
                  )}
                </div>

                {session.status === 'accepted' && (
                  <div className="mt-4">
                    {session.payment_status === 'paid' ? (
                      <div className="border border-blue-200 bg-blue-50 text-blue-900 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Payment Complete</p>
                            <p className="text-sm text-muted-foreground">
                              This session is fully confirmed and paid.
                            </p>
                          </div>
                          <div className="text-blue-600 text-lg font-bold">✔</div>
                        </div>
                      </div>
                    ) : (
                      <PayButton sessionId={session.id} />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
