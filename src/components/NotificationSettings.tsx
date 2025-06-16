
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NotificationService } from '@/services/NotificationService';
import { Bell, Clock, Target } from 'lucide-react';

export const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    taskReminders: true,
    dailyFocus: true,
    goalDeadlines: true
  });

  useEffect(() => {
    const loadSettings = async () => {
      const currentSettings = await NotificationService.getNotificationSettings();
      setSettings(currentSettings);
    };
    loadSettings();
  }, []);

  const updateSetting = async (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await NotificationService.updateNotificationSettings(newSettings);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-primary" />
          <span>Notification Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="task-reminders" className="font-medium">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified 15 minutes before scheduled tasks</p>
            </div>
          </div>
          <Switch
            id="task-reminders"
            checked={settings.taskReminders}
            onCheckedChange={(checked) => updateSetting('taskReminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="daily-focus" className="font-medium">Daily Focus</Label>
              <p className="text-sm text-muted-foreground">Daily reminder to review your goals at 9 AM</p>
            </div>
          </div>
          <Switch
            id="daily-focus"
            checked={settings.dailyFocus}
            onCheckedChange={(checked) => updateSetting('dailyFocus', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="goal-deadlines" className="font-medium">Goal Deadlines</Label>
              <p className="text-sm text-muted-foreground">Get reminded when goal deadlines approach</p>
            </div>
          </div>
          <Switch
            id="goal-deadlines"
            checked={settings.goalDeadlines}
            onCheckedChange={(checked) => updateSetting('goalDeadlines', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
