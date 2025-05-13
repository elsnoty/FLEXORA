import HeaderTrainee from '@/components/shared/headerTrainee';
import SidebarTrainee from '@/components/Trainee_comp/SideBar';
import UserAvatarServer from '@/components/userAvatar';

export default async function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profiles, error } = await UserAvatarServer();
  const ownProfile = profiles?.[0] || null;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderTrainee ownProfile={ownProfile} />
      <div className="flex flex-1">
        <SidebarTrainee />
        <main className="flex-1 p-4 ml-0 md:ml-64 mt-[72px] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}