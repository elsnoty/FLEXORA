import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
programSchema,
moduleSchema,
type ProgramFormValues,
type ModuleFormValues,
} from "@/utils/validation/Programschemas";
import { Program } from "@/Types/programsType";

export function useProgramForms(mode: "create" | "edit", program?: Program) {

const programForm = useForm<ProgramFormValues>({
resolver: zodResolver(programSchema),
defaultValues:
    mode === "create"
    ? {
        name: "",
        description: "",
        duration_weeks: 4,
        price: 0,
        category: "muscle_gain",
        difficulty: "beginner",
        is_public: false,
        }
    : {
        name: program?.name ?? "",
        description: program?.description ?? "",
        duration_weeks: program?.duration_weeks ?? 4,
        price: program?.price ?? 0,
        category: program?.category ?? "muscle_gain",
        difficulty: program?.difficulty ?? "beginner",
        is_public: program?.is_public ?? false,
        },
});

const moduleForm = useForm<ModuleFormValues>({
resolver: zodResolver(moduleSchema),
defaultValues:
    mode === "create"
    ? {
        modules: [
            {
            title: "",
            description: "",
            order_index: 0,
            content_type: "video",
            content_url: "",
            content_title: "",
            content_description: "",
            duration_minutes: null,
            },
        ],
        }
    : {
        modules:
            program?.program_modules_v2?.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description ?? "",
            order_index: m.order_index,
            content_type: m.content_type ?? "video",
            content_url: m.content_url ?? "",
            content_title: m.content_title ?? "",
            content_description: m.content_description ?? "",
            duration_minutes: m.duration_minutes ?? null,
            })) ?? [],
        },
});

return { programForm, moduleForm };
}
