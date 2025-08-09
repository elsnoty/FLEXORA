
import { SessionView } from "@/Types/Sessions";
import Image from "next/image";
import { SessionActions } from "./SessionsActions";

export default function TrainerSessionView({ sessions }: { sessions: SessionView[] }) {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Booked Sessions</h1>
        <ul className="space-y-4">
            {sessions.map((session) => (
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
                </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    {new Date(session.start_time).toLocaleString('en-US', { 
                        timeZone: 'Africa/Cairo',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })} →{' '}
                    {new Date(session.end_time).toLocaleTimeString('en-US', { 
                        timeZone: 'Africa/Cairo',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <div className="mt-1 text-xs text-gray-500 capitalize">
                Status: {session.status}
                {session.rejection_reason && (
                    <span className="text-gray-400"> - {session.rejection_reason}</span>
                )}
                </div>
                
                {session.status === 'pending' && (
                <SessionActions 
                    sessionId={session.id} 
                />
                )}
            </li>
            ))}
        </ul>
        </div>
    );
}