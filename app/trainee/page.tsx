'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TraineePage() {
  const upcomingSession = {
    title: "Leg Day Training",
    trainer: "Coach Ahmed",
    date: "2025-05-10",
    time: "10:00 AM - 11:00 AM",
  };

  const stats = {
    workoutsCompleted: 28,
    totalHours: 42,
    currentGoal: "Lose 3kg by June",
    activePlan: "Fat Burn - 4 Weeks",
  };

  const dailyGoals = [
    { goal: "Drink 2L water", completed: true },
    { goal: "Walk 10,000 steps", completed: false },
    { goal: "Avoid sugar", completed: true },
  ];

  const progressPercentage =
    (dailyGoals.filter((g) => g.completed).length / dailyGoals.length) * 100;

  const schedule = [
    { time: "8:00 AM", activity: "Morning Jog" },
    { time: "10:00 AM", activity: "Leg Day Training" },
    { time: "2:00 PM", activity: "Healthy Lunch" },
    { time: "6:00 PM", activity: "Stretching & Meditation" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, Trainee 👋</h1>

      {/* Upcoming Session */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Session</CardTitle>
          <CardDescription>Don&apos;t miss your next workout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <p><strong>Title:</strong> {upcomingSession.title}</p>
            <p><strong>Trainer:</strong> {upcomingSession.trainer}</p>
            <p><strong>Date:</strong> {upcomingSession.date}</p>
            <p><strong>Time:</strong> {upcomingSession.time}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold">{stats.workoutsCompleted}</p>
            <p className="text-muted-foreground text-sm">Workouts Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold">{stats.totalHours}</p>
            <p className="text-muted-foreground text-sm">Total Hours Trained</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Current Goal</CardTitle>
          <CardDescription>Track your active objective</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg font-semibold">{stats.currentGoal}</p>
          <p className="text-sm text-muted-foreground mt-1">Plan: {stats.activePlan}</p>
        </CardContent>
      </Card>

      {/* Daily Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Goals</CardTitle>
          <CardDescription>
            {progressPercentage === 100
              ? "All goals completed!"
              : "Keep going, you're doing great!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            {dailyGoals.map((goal, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{goal.goal}</span>
                <span
                  className={`text-sm ${
                    goal.completed ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {goal.completed ? "✔️" : "❌"}
                </span>
              </li>
            ))}
          </ul>
          <Progress value={progressPercentage} />
        </CardContent>
      </Card>

      {/* Optional: Today’s Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {schedule.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.time}</span>
                <span>{item.activity}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quote */}
      <Card className="bg-purple-100 text-purple-700 border-none">
        <CardContent className="text-center italic py-6">
          “Progress, not perfection.”
        </CardContent>
      </Card>
    </div>
  );
}
