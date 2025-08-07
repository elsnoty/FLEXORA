import { Metadata } from 'next';
import UserAvatarServer from '@/app/actions/userAvatar';

const MAX_TITLE_LENGTH = 60;
const MAX_DESC_LENGTH = 160;

export async function getUserMetadata(base: {
    title: string;
    description: string;
    showName?: boolean;
    fallbackTitle?: string;
    role?: 'trainer' | 'trainee'
    }): Promise<Metadata> {
    try {
        const { profiles } = await UserAvatarServer();
        const userProfile = base.role 
        ? profiles?.find(p => p.role === base.role) || null
        : profiles?.[0] || null;
        const truncate = (text: string, max: number) => 
        text.length > max ? `${text.substring(0, max-3)}...` : text;

        // Conditionally include name only when showName=true
        const title = base.showName && userProfile?.name
        ? truncate(`${userProfile.name} ${base.title}`, MAX_TITLE_LENGTH)
        : truncate(base.title, MAX_TITLE_LENGTH);

        return {
        title,
        description: truncate(base.description, MAX_DESC_LENGTH),
        openGraph: {
            images: userProfile?.avatar_url 
            ? [{ url: userProfile.avatar_url }] 
            : []
        }
        };
    } catch {
        return {
        title: base.fallbackTitle || 'Flexora Platform',
        description: base.description
        };
    }
}