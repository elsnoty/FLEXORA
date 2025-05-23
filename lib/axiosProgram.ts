import axios from "axios";
import { toast } from "sonner";
import { Program, BaseModule, BaseModuleContent } from "@/Types/programsType";
import { ContentFormValues, ModuleFormValues, ProgramFormValues } from "@/utils/validation/Programschemas";

// Create an axios instance with default config
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || "An error occurred";
    toast.error(message);
    return Promise.reject(error);
  }
);

// API endpoints for programs with proper typing
export const programApi = {
  // Program endpoints
  create: (data: ProgramFormValues) => api.post<Program>("/trainer/programs", data),
  getAll: () => api.get<Program[]>("/trainer/programs"),
  getById: (id: string) => api.get<Program>(`/trainer/programs/${id}`),
    
  // Module endpoints
  createModules: (programId: string, data: ModuleFormValues) => 
    api.post<{ moduleIds: string[] }>(`/trainer/programs/${programId}/modules`, data),
  
  
  // Content endpoints
  createContent: (programId: string, data: ContentFormValues) => 
    api.post(`/trainer/programs/${programId}/content`, data),
}