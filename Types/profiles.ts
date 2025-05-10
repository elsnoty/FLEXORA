export interface Profile {
    id: number;
    user_id: string;
    name: string;
    avatar_url?: string ;
    bio?: string | null;
    height?: number | null;
    weight?: number | null;
    location?: string | null;
    phone_number?: string | null;
    email?: string;
    gender: string;
}