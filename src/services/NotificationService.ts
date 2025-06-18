import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { AIService } from './AIService';
import type { ProjectWithTasks } from '@/hooks/useProjects';

type MotivationCategory = "preSession" | "midSession" | "postSession" | "hypeUp" | "guiltTrip";

export class MotivationService {
  private static messages: Record<MotivationCategory, string[]> = {
    preSession: [],
    midSession: [],
    postSession: [],
    hypeUp: [],
    guiltTrip: [],
  };

  static async loadMessages() {
    if (MotivationService.messages.preSession.length > 0) return; // Already loaded
    const res = await fetch("/assets/motivation_messages.json");
    const data = await res.json();
    MotivationService.messages = data;
  }

  static async getRandom(category: MotivationCategory): Promise<string> {
    await MotivationService.loadMessages();
    const arr = MotivationService.messages[category] || [];
    if (arr.length === 0) return "Stay motivated!";
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export class NotificationService {
  static init() {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then(() => {
        console.log("Notification permissions granted");
      });
    }
  }
  static scheduleGoalNotifications(arg0: { name: string; preferredTimes: string[]; }) {
    throw new Error("Method not implemented.");
  }
  static async initialize() {
    try {
      // Request notification permissions
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        console.log('Notification permissions granted');
        return true;
      } else {
        console.log('Notification permissions denied');
        return false;
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  static async scheduleTaskReminder(task: any, project: ProjectWithTasks) {
    if (!task.assigned_date || !task.assigned_time) return;

    const taskDateTime = new Date(`${task.assigned_date}T${task.assigned_time}`);
    const notificationTime = new Date(taskDateTime.getTime() - 15 * 60 * 1000); // 15 minutes before

    if (notificationTime <= new Date()) return; // Don't schedule past notifications

    try {
      // Generate AI-powered notification message
      const aiMessage = await AIService.generateNotificationMessage('task_reminder', {
        taskTitle: task.title,
        projectTitle: project.title
      });

      await LocalNotifications.schedule({
        notifications: [
          {
            title: '⏰ Task Reminder',
            body: aiMessage,
            id: parseInt(task.id.replace(/-/g, '').substring(0, 8), 16),
            schedule: { at: notificationTime },
            sound: 'default',
            actionTypeId: 'TASK_REMINDER',
            extra: {
              taskId: task.id,
              projectId: project.id,
              type: 'task_reminder'
            }
          }
        ]
      });

      console.log(`Scheduled AI reminder for task: ${task.title} at ${notificationTime}`);
    } catch (error) {
      console.error('Error scheduling task reminder:', error);
    }
  }

  static async scheduleDailyFocusReminder() {
    try {
      // Generate AI-powered daily focus message
      const aiMessage = await AIService.generateNotificationMessage('daily_focus', {});

      await LocalNotifications.schedule({
        notifications: [
          {
            title: '🎯 Daily Focus Time',
            body: aiMessage,
            id: 999999,
            schedule: {
              on: {
                hour: 9,
                minute: 0
              },
              repeats: true
            },
            sound: 'default',
            actionTypeId: 'DAILY_FOCUS',
            extra: {
              type: 'daily_focus'
            }
          }
        ]
      });

      console.log('Scheduled AI-powered daily focus reminder');
    } catch (error) {
      console.error('Error scheduling daily focus reminder:', error);
    }
  }

  static async scheduleGoalDeadlineReminder(project: ProjectWithTasks) {
    if (!project.deadline) return;

    const deadline = new Date(project.deadline);
    const reminderTime = new Date(deadline.getTime() - 24 * 60 * 60 * 1000); // 1 day before

    if (reminderTime <= new Date()) return;

    try {
      // Generate AI-powered deadline reminder message
      const aiMessage = await AIService.generateNotificationMessage('goal_deadline', {
        projectTitle: project.title
      });

      await LocalNotifications.schedule({
        notifications: [
          {
            title: '⚠️ Goal Deadline Approaching',
            body: aiMessage,
            id: parseInt(project.id.replace(/-/g, '').substring(0, 8), 16) + 1000000,
            schedule: { at: reminderTime },
            sound: 'default',
            actionTypeId: 'GOAL_DEADLINE',
            extra: {
              projectId: project.id,
              type: 'goal_deadline'
            }
          }
        ]
      });

      console.log(`Scheduled AI deadline reminder for: ${project.title}`);
    } catch (error) {
      console.error('Error scheduling goal deadline reminder:', error);
    }
  }

  static async clearTaskReminder(taskId: string) {
    try {
      const notificationId = parseInt(taskId.replace(/-/g, '').substring(0, 8), 16);
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    } catch (error) {
      console.error('Error clearing task reminder:', error);
    }
  }

  static async getNotificationSettings() {
    try {
      const settings = await Preferences.get({ key: 'notification_settings' });
      return settings.value ? JSON.parse(settings.value) : {
        taskReminders: true,
        dailyFocus: true,
        goalDeadlines: true
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        taskReminders: true,
        dailyFocus: true,
        goalDeadlines: true
      };
    }
  }

  static async updateNotificationSettings(settings: any) {
    try {
      await Preferences.set({
        key: 'notification_settings',
        value: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }
}
