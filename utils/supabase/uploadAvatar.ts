import { AppError } from '../AppError';
import { createClient } from './server';
import { randomUUID } from 'crypto';

    export async function uploadAvatar(userId: string, file: File) {
    const supabase = await createClient();
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = Number(process.env.MAX_AVATAR_SIZE) || 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
    throw new AppError('Only JPEG, PNG, or WebP images allowed');
    }
    if (file.size > maxSize) {
    throw new AppError('Image must be smaller than 2MB');
    }

    // Remove old files
    const { data: oldFiles } = await supabase.storage
    .from('avatar')
    .list(`${userId}/`);
    if (oldFiles?.length) {
    await supabase.storage
        .from('avatar')
        .remove(oldFiles.map((f) => `${userId}/${f.name}`));
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${userId}/${randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
    .from('avatar')
    .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
    });

    if (error) {
    throw new AppError(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
    .from('avatar')
    .getPublicUrl(fileName);

    return publicUrl;
}