import { supabase } from '@/lib/supabaseClient';

export class AIService {
  static async generateDailyEncouragement(userName: string, projects: any[]) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-encouragement', {
        body: {
          userName,
          projects: projects.map(p => ({
            title: p.title,
            progress: p.progress || 0,
            deadline: p.deadline,
            tasksCount: p.tasks?.length || 0,
            completedTasks: p.tasks?.filter((t: any) => t.completed).length || 0
          }))
        }
      });

      if (error) throw error;
      return data.message;
    } catch (error) {
      console.error('Error generating daily encouragement:', error);
      return `Keep pushing forward, ${userName}! Every small step counts toward your goals.`;
    }
  }

  static async generateNotificationMessage(type: 'task_reminder' | 'daily_focus' | 'goal_deadline', context: any) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-notification-message', {
        body: { type, context }
      });

      if (error) throw error;
      return data.message;
    } catch (error) {
      console.error('Error generating notification message:', error);
      // Fallback messages
      switch (type) {
        case 'task_reminder':
          return `Time to focus on "${context.taskTitle}"`;
        case 'daily_focus':
          return 'Ready to tackle your goals today?';
        case 'goal_deadline':
          return `"${context.projectTitle}" deadline is approaching!`;
        default:
          return 'Stay focused on your goals!';
      }
    }
  }

}

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dmhrZXd5dHRsbmRmYXR1d3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Mzg4OTgsImV4cCI6MjA2NTUxNDg5OH0.o20piT6ELEYzSERV7fNn7NyN2CPgBkKiv-wTmjsiDK4EY";

export async function generateNotificationMessage(type: string, context?: any) {
  const response = await fetch(
    "https://xuvhkewyttlndfatuwqv.supabase.co/functions/v1/generate-notification-message",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ type, context }),
    }
  );
  const data = await response.json();
  return data.message;
}
