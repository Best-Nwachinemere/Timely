import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Target, Clock, CheckCircle2, Calendar, Settings as SettingsIcon } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  assignedDate?: string;
  assignedTime?: string;
  completed: boolean;
  projectTitle: string;
}

const DailyFocus = () => {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalTimeToday, setTotalTimeToday] = useState(0);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('timely_projects') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    const allTasks: Task[] = [];
    projects.forEach((project: any) => {
      project.tasks.forEach((task: any) => {
        if (task.assignedDate === today) {
          allTasks.push({
            ...task,
            projectTitle: project.title
          });
        }
      });
    });

    // Sort by assigned time
    allTasks.sort((a, b) => {
      if (!a.assignedTime || !b.assignedTime) return 0;
      return a.assignedTime.localeCompare(b.assignedTime);
    });

    setTodayTasks(allTasks);
    setCompletedToday(allTasks.filter(task => task.completed).length);
    setTotalTimeToday(allTasks.reduce((total, task) => total + task.estimatedTime, 0));
  }, []);

  const toggleTaskComplete = (taskId: string, projectId: string) => {
    const projects = JSON.parse(localStorage.getItem('timely_projects') || '[]');
    
    const updatedProjects = projects.map((project: any) => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map((task: any) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        
        const completedTasks = updatedTasks.filter((task: any) => task.completed).length;
        const progress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;
        
        return { ...project, tasks: updatedTasks, progress };
      }
      return project;
    });

    localStorage.setItem('timely_projects', JSON.stringify(updatedProjects));
    
    // Update local state
    const updatedTodayTasks = todayTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTodayTasks(updatedTodayTasks);
    setCompletedToday(updatedTodayTasks.filter(task => task.completed).length);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCurrentTimeBlock = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return todayTasks.find(task => {
      if (!task.assignedTime) return false;
      const taskTime = task.assignedTime;
      const taskEndTime = new Date();
      const [hours, minutes] = taskTime.split(':').map(Number);
      taskEndTime.setHours(hours, minutes + task.estimatedTime);
      const endTimeString = `${taskEndTime.getHours().toString().padStart(2, '0')}:${taskEndTime.getMinutes().toString().padStart(2, '0')}`;
      
      return currentTime >= taskTime && currentTime <= endTimeString;
    });
  };

  const currentTask = getCurrentTimeBlock();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild className="rounded-lg">
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold font-accent">Daily Focus</h1>
                <p className="text-sm text-muted-foreground">Today's FocusFrame</p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" asChild className="rounded-lg">
              <Link to="/settings">
                <SettingsIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="goal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl font-bold">{todayTasks.length}</span>
              </div>
              <h3 className="font-medium text-sm">Tasks Today</h3>
            </CardContent>
          </Card>

          <Card className="goal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <span className="text-2xl font-bold">{completedToday}</span>
              </div>
              <h3 className="font-medium text-sm">Completed</h3>
            </CardContent>
          </Card>

          <Card className="goal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <span className="text-2xl font-bold">{formatTime(totalTimeToday)}</span>
              </div>
              <h3 className="font-medium text-sm">Total Time</h3>
            </CardContent>
          </Card>
        </div>

        {/* Current Task Highlight */}
        {currentTask && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Now Focus On</h3>
                  <p className="text-xl font-bold mb-2">{currentTask.title}</p>
                  <p className="text-sm text-muted-foreground">{currentTask.projectTitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Time allocated</div>
                  <div className="text-lg font-semibold text-primary">{formatTime(currentTask.estimatedTime)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Schedule */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold font-accent">Today's Schedule</h3>
          
          {todayTasks.length === 0 ? (
            <Card className="goal-card text-center py-12">
              <CardContent>
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks scheduled for today</h3>
                <p className="text-muted-foreground mb-4">Go to your projects to schedule some tasks</p>
                <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl">
                  <Link to="/dashboard">
                    View Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`focus-view-task ${task.completed ? 'opacity-60' : ''} ${
                    currentTask?.id === task.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          // Find the project this task belongs to
                          const projects = JSON.parse(localStorage.getItem('timely_projects') || '[]');
                          const project = projects.find((p: any) => 
                            p.tasks.some((t: any) => t.id === task.id)
                          );
                          if (project) {
                            toggleTaskComplete(task.id, project.id);
                          }
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors ${
                          task.completed 
                            ? 'bg-success border-success' 
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-4 h-4 text-white m-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {task.assignedTime && (
                            <span className="text-sm font-mono text-primary font-medium">
                              {task.assignedTime}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{task.projectTitle}</span>
                        </div>
                        
                        <h4 className={`font-semibold mb-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h4>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-medium text-primary">
                          {formatTime(task.estimatedTime)}
                        </div>
                        {currentTask?.id === task.id && (
                          <div className="text-xs text-primary font-medium mt-1">
                            Current
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DailyFocus;
