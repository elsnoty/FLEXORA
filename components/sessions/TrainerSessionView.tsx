
import { SessionView } from "@/Types/Sessions";
import Image from "next/image";
import { SessionActions } from "./SessionsActions";
import { TimeDisplay } from "../TImeDisplay";

export default function TrainerSessionView({ sessions }: { sessions: SessionView[] }) {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Booked Sessions</h1>
        <ul className="space-y-4">
            {sessions.map((session) => {
                const sessionStartTime = new Date(session.start_time);
                const currentTime = new Date();
                const isPastSession = sessionStartTime < currentTime;

                return (
            <li key={session.id} className="border p-4 rounded-md shadow-sm">
                <div className="flex items-center gap-3">
                {session.trainee_avatar && (
                    <Image
                    width={50}
                    height={50}
                    src={session.trainee_avatar} 
                    alt="Trainee avatar"
                    className="rounded-full"
                    />
                )}
                <div className="font-medium">
                    {session.trainee_name}
                    {isPastSession && session.status === 'pending' && (
                        <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            Time Passed
                        </span>
                    )}
                </div>
                </div>
<TimeDisplay startTime={session.start_time} endTime={session.end_time} />
                <div className="mt-1 text-xs text-gray-500 capitalize">
                Status: {session.status}
                {session.rejection_reason && (
                    <span className="text-gray-400"> - {session.rejection_reason}</span>
                )}
                </div>
                
                {session.status === 'pending' && (
                    isPastSession ? (
                        <div className="mt-3 text-sm text-muted-foreground italic">
                            Cannot accept - session time has passed
                        </div>
                    ) : (
                        <SessionActions sessionId={session.id} />
                    )
                )}
            </li>
                );
            })}
        </ul>
        </div>
    );
}