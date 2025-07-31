
export interface TrainerProfile {
    name: string;
    avatar_url: string | null;
}

export interface Trainer {
    user_id: string;
    specialization: string | null;
    hourly_rate: number | null;
    is_active: boolean;
    profiles: TrainerProfile[] | null;
}

export interface ProgramModule {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
    content_type: string | null;
    content_url: string | null;
    content_title: string | null;
    content_description: string | null;
    duration_minutes: number | null;
}
export interface TrainingProgram {
    id: string;
    program_modules_v2: ProgramModule[];
}