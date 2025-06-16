import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { BackButton } from '@/components/ui/back-button';
import { Footer } from './Footer';
import { User, Bell, Calendar, Trash2, Download } from 'lucide-react';
import { NotificationSettings } from '@/components/NotificationSettings';

const Settings = () => {
  const [userEmail, setUserEmail] = useState('');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Load settings
    const email = localStorage.getItem('timely_user_email') || '';
    const settings = JSON.parse(localStorage.getItem('timely_settings') || '{}');
    
    setUserEmail(email);
    setNotifications(settings.notifications !== false); // Default to true
  }, []);

  const handleSaveEmail = () => {
    localStorage.setItem('timely_user_email', userEmail);
    console.log('Email saved:', userEmail);
  };

  const handleExportData = () => {
    const projects = localStorage.getItem('timely_projects') || '[]';
    const settingsRaw = localStorage.getItem('timely_settings') || '{}';
    let settings = {};
    try {
      settings = JSON.parse(settingsRaw);
      delete (settings as {darkMode?: boolean}).darkMode;
    } catch(e) {
      console.error("Failed to parse settings for export", e);
    }
    
    const email = localStorage.getItem('timely_user_email') || '';
    
    const exportData = {
      projects: JSON.parse(projects),
      settings: settings,
      userEmail: email,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timely-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all your projects and settings.')) {
      localStorage.removeItem('timely_projects');
      localStorage.removeItem('timely_settings');
      localStorage.removeItem('timely_user_email');
      localStorage.removeItem('timely_onboarding_complete');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex flex-col">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton to="/dashboard" />
              <Logo showText={false} />
              <div>
                <h1 className="text-xl font-bold font-accent">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your preferences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-accent">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="rounded-xl h-12"
                  />
                  <Button 
                    onClick={handleSaveEmail}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl px-6 font-accent"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <NotificationSettings />

          {/* Data Management */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-secondary/5">
            <CardHeader>
              <CardTitle className="font-accent">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleExportData}
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-primary/30 hover:bg-primary/10 font-accent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button 
                  onClick={handleClearData}
                  variant="destructive"
                  className="flex-1 rounded-xl h-12 font-accent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Export your data for backup or import into other apps. Clear all data will permanently delete everything.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
