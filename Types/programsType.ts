type ContentType = "video" | "document" | "meal_plan" | "workout";

interface BaseModuleContent {
  id: string;
  content_type: ContentType;
  content_url: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
}

// 2. Define base module type 
interface BaseModule {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  module_content: BaseModuleContent[];
}

// 3. Define program category/difficulty as standalone types
type ProgramCategory = "weight_loss" | "muscle_gain" | "rehabilitation" | "endurance";
type ProgramDifficulty = "beginner" | "intermediate" | "advanced";

// 4. Main Program type (extends nothing, but uses BaseModule)
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
  program_modules: BaseModule[];
}

export type { Program, BaseModule, BaseModuleContent, ContentType, ProgramCategory, ProgramDifficulty };
