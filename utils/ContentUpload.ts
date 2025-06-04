'use server'
import { createClient } from "@/utils/supabase/server";
import { AppError } from "./AppError";
import { randomUUID } from "crypto";

export async function uploadContentFile(
  moduleId: string,
  file: File,
  previousPath?: string
) {
  const supabase = await createClient();
  
  // Validation
  const validTypes = [
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/webp'
  ];
  
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!validTypes.includes(file.type)) {
    throw new AppError('Invalid file type. Supported: videos, PDFs, Word, Excel, images');
  }

  if (file.size > maxSize) {
    throw new AppError(`File must be smaller than ${maxSize / 1024 / 1024}MB`);
  }

  // Remove previous file if exists
  if (previousPath) {
    await supabase.storage
      .from('program-content')
      .remove([previousPath]);
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const filePath = `${moduleId}/${randomUUID()}.${fileExt}`;

  // Upload new file
  const { error } = await supabase.storage
    .from('program-content')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new AppError(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('program-content')
    .getPublicUrl(filePath);

  return {
    publicUrl,
    filePath,
    fileType: file.type,
    fileSize: file.size
  };
}