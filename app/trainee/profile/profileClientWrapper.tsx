'use client';
import dynamic from 'next/dynamic';

const ProfileClient = dynamic(() => import('./ProfileClient'), { 
ssr: false,
loading: () => <p>Loading...</p>
});

export default function ProfileClientWrapper() {
return <ProfileClient />;
}