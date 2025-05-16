import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, TrainerProfileSchema } from "@/utils/validation/ProfileSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { z } from "zod";

export type ProfileFormValues = z.infer<typeof ProfileSchema>;
export type TrainerFormValues = z.infer<typeof TrainerProfileSchema>;
export type CombinedFormValues = ProfileFormValues & Partial<TrainerFormValues>;

export default function ProfileForm({
  defaultValues,
  role,
  handleSubmit,
  isLoading,
  error,
}: {
  defaultValues: ProfileFormValues;
  handleSubmit: (data: CombinedFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  file: File | null;
  role: 'trainer' | 'trainee'
}) {
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<CombinedFormValues>({
    resolver: zodResolver(
        role === 'trainer' 
        ? ProfileSchema.merge(TrainerProfileSchema) 
        : ProfileSchema
    ),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await handleSubmit(data);
  };

  return (
    <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          {...register("name")}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          {...register("bio")}
          disabled={isLoading}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
        />
        {errors.bio && (
          <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            {...register("height", { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.height && (
            <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            {...register("weight", { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register("location")}
          disabled={isLoading}
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          {...register("phone_number")}
          disabled={isLoading}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
        )}
      </div>
    {role === 'trainer' && (
        <>
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              {...register("specialization")}
              disabled={isLoading}
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="hourly_rate">Hourly Rate</Label>
            <Input
              id="hourly_rate"
              type="number"
              {...register("hourly_rate", { valueAsNumber: true })}
              disabled={isLoading}
            />
            {errors.hourly_rate && (
              <p className="text-red-500 text-sm mt-1">{errors.hourly_rate.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="is_active">Active Trainer</Label>
            {errors.is_active && (
              <p className="text-red-500 text-sm mt-1">{errors.is_active.message}</p>
            )}
          </div>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}