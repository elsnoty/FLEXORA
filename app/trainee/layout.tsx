import HeaderTrainee from '@/components/shared/headerTrainee';
import SidebarTrainee from '@/components/Trainee_comp/TraineeSideBar';
import { GetTraineeSideLinks } from '@/components/Trainee_comp/TraineeSideLinks';
import UserAvatarServer from '@/app/actions/userAvatar';

export default async function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profiles, error } = await UserAvatarServer();
  const ownProfile = profiles?.find(profile => profile.role === 'trainee') || null;

  if (error) {
    return <div>Error: {error}</div>;
  }
   
  if (!ownProfile) {
    return <div>No profile found</div>;
  }
  const links = await GetTraineeSideLinks();

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderTrainee ownProfile={ownProfile} />
      <div className="flex flex-1">
        <SidebarTrainee links={links} />
        <main className="flex-1 p-4 ml-0 md:ml-64 mt-[72px] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}