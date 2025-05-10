import { Profile } from "@/Types/profiles";

export default function ProfileDetails({ profile }: { profile: Profile }) {
    return (
    <div className="space-y-1">
    <p><span className="font-semibold">Bio:</span> {profile.bio || '—'}</p>
    <p><span className="font-semibold">Height:</span> {profile.height || '—'} cm</p>
    <p><span className="font-semibold">Weight:</span> {profile.weight || '—'} kg</p>
    <p><span className="font-semibold">Location:</span> {profile.location || '—'}</p>
    <p><span className="font-semibold">Phone:</span> {profile.phone_number || '—'}</p>
    <p><span className="font-semibold">Gender:</span> {profile.gender}</p>
    </div>
);
}