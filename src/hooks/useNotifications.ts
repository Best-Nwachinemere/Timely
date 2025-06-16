
import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationService } from '@/services/NotificationService';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { projects } = useProjects();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize notifications when the hook mounts
    const initNotifications = async () => {
      const initialized = await NotificationService.initialize();
      
      if (initialized) {
        // Schedule daily focus reminder
        await NotificationService.scheduleDailyFocusReminder();
        
        // Set up notification action listeners
        LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
          const { extra } = notification.notification;
          
          switch (extra?.type) {
            case 'task_reminder':
              toast({
                title: "Task Starting Soon!",
                description: `Your scheduled task is about to begin.`,
              });
              break;
            case 'daily_focus':
              toast({
                title: "Daily Focus Time!",
                description: "Time to review your goals and plan your day.",
              });
              break;
            case 'goal_deadline':
              toast({
                title: "Goal Deadline Approaching!",
                description: "One of your goals is due soon.",
                variant: "destructive"
              });
              break;
          }
        });
      }
    };

    initNotifications();

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, [toast]);

  // Schedule notifications for new projects and tasks
  useEffect(() => {
    projects.forEach(project => {
      // Schedule goal deadline reminders
      NotificationService.scheduleGoalDeadlineReminder(project);
      
      // Schedule task reminders
      project.tasks.forEach(task => {
        if (!task.completed) {
          NotificationService.scheduleTaskReminder(task, project);
        }
      });
    });
  }, [projects]);

  const scheduleTaskNotification = async (task: any, project: any) => {
    await NotificationService.scheduleTaskReminder(task, project);
  };

  const clearTaskNotification = async (taskId: string) => {
    await NotificationService.clearTaskReminder(taskId);
  };

  return {
    scheduleTaskNotification,
    clearTaskNotification
  };
};
