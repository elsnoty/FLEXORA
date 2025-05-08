'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import CropModal from "@/components/Trainee_comp/cropModal";
import { useProfileUpdate } from "@/hooks/use-profileUpdate";

export default function TraineeProfile({ profile }: { profile: { id: number; name: string; avatar_url: string; } }) {
  const [name, setName] = useState(profile.name);
  const [file, setFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const { handleSubmit, isLoading, error } = useProfileUpdate();

  // Open crop modal when file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsCropModalOpen(true);
    }
  };

  return (
    <div className="w-full px-4 mt-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your name or avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <Avatar className="w-20 h-20 cursor-pointer hover:opacity-80 rounded-full">
                  <AvatarImage src={file ? URL.createObjectURL(file) : profile.avatar_url} />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Preview</DialogTitle>
                <DialogDescription />
                <img
                  src={file ? URL.createObjectURL(file) : profile.avatar_url}
                  alt="Full Avatar"
                  className="rounded-full w-64 h-64 object-cover"
                />
              </DialogContent>
            </Dialog>
            <div>
              <Label htmlFor="avatarUpload">Change Avatar</Label>
              <Input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e, name, file)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <CropModal
        file={file}
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onConfirm={(croppedFile: File) => setFile(croppedFile)}
      />
    </div>
  );
}
