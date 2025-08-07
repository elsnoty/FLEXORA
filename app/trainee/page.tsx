import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { getUserMetadata } from "@/lib/user-metadata";

export async function generateMetadata() {
  return getUserMetadata({
    title: 'Fitness Dashboard',
    description: 'Your personalized fitness tracking hub',
    fallbackTitle: 'My Fitness Dashboard',
  });
}

async function TraineeHomeContent() {
  // Simple server-side data fetch
  const basicData = await fetchBasicTraineeData(); // Your data fetching function

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl">Welcome back, Trainee 👋</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Active Plan: {basicData.activePlan}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TraineePage() {
  return (
      <TraineeHomeContent />
  );
}

// Simple mock data fetch
async function fetchBasicTraineeData() {
  return {
    activePlan: "Fat Burn - 4 Weeks"
  };
}