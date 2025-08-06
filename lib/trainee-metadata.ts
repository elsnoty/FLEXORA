// lib/trainee-metadata.ts
import { Metadata } from 'next';
import UserAvatarServer from '@/app/actions/userAvatar';

// SEO best practice limits
const MAX_TITLE_LENGTH = 60; // Google typically displays 50-60 chars
const MAX_DESCRIPTION_LENGTH = 160; // Meta descriptions truncated at ~160 chars

export async function getTraineeMetadata(base: {
    title: string;
    description: string;
    fallbackTitle?: string;
    fallbackDescription?: string;
    }): Promise<Metadata> {
    try {
        const { profiles } = await UserAvatarServer();
        const traineeProfile = profiles?.find(profile => profile.role === 'trainee') || null;

        // Truncate title and description to SEO-friendly lengths
        const truncate = (text: string, maxLength: number) => 
        text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;

        const title = truncate(
        traineeProfile?.name 
            ? `${traineeProfile.name} | ${base.title}`
            : base.fallbackTitle || base.title,
        MAX_TITLE_LENGTH
        );

        const description = truncate(
        base.description,
        MAX_DESCRIPTION_LENGTH
        );

        return {
        title,
        description,
        openGraph: {
            
        },
        };
    } catch (error) {
        // Fallback if metadata generation fails
        return {
        title: base.fallbackTitle || 'Fitness Platform',
        description: base.fallbackDescription || 'Your fitness journey starts here',
        };
    }
}