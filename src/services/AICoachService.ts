import { Goal } from "@/models/Goal";

export class AICoachService {
  static getTip(goals: Goal[]): string {
    if (!goals.length) return "Set a goal to get started!";
    const lowProgress = goals.find(g => (g.progress || 0) < 30);
    const highStreak = goals.find(g => (g.streak || 0) >= 7);
    const noRecent = goals.find(g =>
      !g.journalNotes?.some((n: any) => n.timestamp.slice(0, 10) === new Date().toISOString().slice(0, 10))
    );

    if (highStreak) return `🔥 You're on a streak with "${highStreak.name}"! Keep it up!`;
    if (lowProgress) return `Try breaking "${lowProgress.name}" into smaller steps for momentum.`;
    if (noRecent) return `Don't forget to log a session for "${noRecent.name}" today!`;
    return "You're making great progress! Stay consistent and celebrate your wins.";
  }
}