
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { DailyEncouragement } from '@/components/DailyEncouragement';
import { Plus, Calendar, Clock, Settings, Sparkles, TrendingUp, LogOut } from 'lucide-react';
import { getGreeting } from '@/lib/greetings';

const Dashboard = () => {
  const { user, signOut, profile } = useAuth();
  const { projects, loading } = useProjects();
  const [greeting, setGreeting] = useState({ title: '', subtitle: '' });

  useEffect(() => {
    const username = profile?.full_name || (user?.email ? user.email.split('@')[0] : null);
    setGreeting(getGreeting(username));
  }, [user, profile]);

  const getTimeUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const getNextTask = (project: any) => {
    if (project.tasks && project.tasks.length > 0) {
      const incompleteTasks = project.tasks.filter((task: any) => !task.completed);
      return incompleteTasks.length > 0 ? incompleteTasks[0].title : 'All tasks complete!';
    }
    return 'No tasks yet';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex flex-col">
      {/* Enhanced Header with new colors */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-accent/20">
                <Link to="/settings">
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="rounded-xl hover:bg-accent/20 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1">
        {/* Enhanced Welcome Section with new typography */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-accent gradient-text-primary">
                {greeting.title}
              </h2>
              <p className="text-muted-foreground font-medium">
                {greeting.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* AI-Powered Daily Encouragement */}
        {profile?.full_name && (
          <DailyEncouragement 
            userName={profile.full_name.split(' ')[0]} 
            projects={projects} 
          />
        )}

        {/* Enhanced Quick Actions with new color scheme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-primary to-accent text-white overflow-hidden relative">
            <CardContent className="p-6">
              <Button asChild className="w-full h-auto p-0 bg-transparent hover:bg-white/10 border-0 shadow-none">
                <Link to="/onboarding">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-lg font-accent">New Project</div>
                      <div className="text-sm opacity-90">Start a new goal</div>
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/10">
            <CardContent className="p-6">
              <Button variant="ghost" asChild className="w-full h-auto p-0 hover:bg-accent/10">
                <Link to="/focus">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold font-accent">Today's Focus</div>
                      <div className="text-sm text-muted-foreground">Your daily tasks</div>
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/10">
            <CardContent className="p-6">
              <Button variant="ghost" asChild className="w-full h-auto p-0 hover:bg-secondary/20">
                <Link to="/settings">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-success" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold font-accent">Calendar Sync</div>
                      <div className="text-sm text-muted-foreground">Connect your calendar</div>
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Projects Grid */}
        {projects.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-accent gradient-text-primary">Your Projects</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>{projects.filter(p => (p.progress || 0) > 0).length} active</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/30 hover:-translate-y-1 bg-gradient-to-br from-card to-secondary/5">
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      {/* Project Header */}
                      <div>
                        <h4 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors font-accent">{project.title}</h4>
                        {project.deadline && (
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                            {getTimeUntilDeadline(project.deadline)}
                          </Badge>
                        )}
                      </div>

                      {/* Enhanced Progress */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="font-bold text-primary font-accent">{project.progress || 0}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={project.progress || 0} className="h-3 bg-cloudveil/30" />
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full"></div>
                        </div>
                      </div>

                      {/* Next Task */}
                      <div className="bg-gradient-to-r from-secondary/20 to-accent/10 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide font-accent">Next Task</p>
                        <p className="text-sm font-semibold">{getNextTask(project)}</p>
                      </div>

                      {/* Actions */}
                      <Button asChild className="w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold font-accent">
                        <Link to={`/project/${project.id}`}>
                          Open Project
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Enhanced Empty State
          <Card className="border-0 bg-gradient-to-br from-card/50 to-secondary/10">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-accent gradient-text-primary">No projects yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                Create your first project and start breaking down your big goals into manageable daily tasks.
              </p>
              <Button asChild className="rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold px-8 py-3 text-lg font-accent">
                <Link to="/onboarding">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
