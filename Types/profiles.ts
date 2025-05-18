export interface Profile extends TrainerProfile{
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
    role: 'trainer' | 'trainee';
}

export interface TrainerProfile{
    specialization: string;
    hourly_rate: number;
    is_active: boolean;
}

export interface Trainer {
    user_id: string;
    specialization: string;
    hourly_rate: number;
    profiles: {
      name: string;
      avatar_url: string | null;
    };
  }