type ContentType = "video" | "document" | "meal_plan" | "workout";

interface ProgramModule {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  order_index: number;
  content_type: ContentType | null;
  content_url: string | null;
  content_title: string | null;
  content_description: string | null;
  duration_minutes: number | null;
}

type ProgramCategory = "weight_loss" | "muscle_gain" | "rehabilitation" | "endurance";
type ProgramDifficulty = "beginner" | "intermediate" | "advanced";

interface Program {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  price: number;
  category: ProgramCategory;
  difficulty: ProgramDifficulty;
  cover_image_url: string | null;
  created_at: string;
  program_modules_v2: ProgramModule[];
  is_public: boolean;
  trainer_id?: string;
}

export type { Program, ProgramModule, ContentType, ProgramCategory, ProgramDifficulty };