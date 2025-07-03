import HeaderTrainee from '@/components/shared/headerTrainee';
import TrainerSideBar from '@/components/Trainer_comp/TrainerSideBar';
import { GetTrainerSideLinks } from '@/components/Trainer_comp/TrainerSideBarLinks';
import UserAvatarServer from '@/app/actions/userAvatar';

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profiles, error } = await UserAvatarServer();
  const ownProfile = profiles?.find(profile =>profile.role === 'trainer') || null;

  if (error) {
    return <div>Error: {error}</div>;
  }
   
  if (!ownProfile) {
    return <div>No profile found</div>;
  }
  const links = await GetTrainerSideLinks();

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderTrainee ownProfile={ownProfile} />
      <div className="flex flex-1">
        <TrainerSideBar links={links} />
        <main className="flex-1 p-4 ml-0 md:ml-64 mt-[72px] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}