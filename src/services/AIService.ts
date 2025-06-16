
import { supabase } from '@/integrations/supabase/client';

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
