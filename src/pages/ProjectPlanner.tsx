
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Logo } from '@/components/ui/logo';
import { BackButton } from '@/components/ui/back-button';
import { Footer } from './Footer';
import { useProjects, ProjectWithTasks } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Plus, Clock, Target, Calendar, Settings as SettingsIcon, Focus } from 'lucide-react';

const ProjectPlanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectWithTasks | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(60);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { projects, updateProject, refetch } = useProjects();
  const { createTask, updateTask } = useTasks();

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    } else if (projects.length > 0) {
      navigate('/dashboard');
    }
  }, [id, navigate, projects]);

  const addTask = async () => {
    if (!newTaskTitle || !project) return;

    const newTask = await createTask({
      project_id: project.id,
      title: newTaskTitle,
      description: newTaskDescription,
      estimated_time: newTaskTime,
      completed: false
    });

    if (newTask) {
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskTime(60);
      setIsDialogOpen(false);
      await refetch();
    }
  };

  const toggleTaskComplete = async (taskId: string, currentStatus: boolean) => {
    if (!project) return;

    const success = await updateTask(taskId, { completed: !currentStatus });
    
    if (success) {
      // Calculate new progress
      const updatedTasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      );
      
      const completedTasks = updatedTasks.filter(task => task.completed).length;
      const progress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;

      await updateProject(project.id, { progress });
      await refetch();
    }
  };

  const assignTaskToTimeSlot = async (taskId: string, date: string, time: string) => {
    if (!project) return;

    await updateTask(taskId, { 
      assigned_date: date, 
      assigned_time: time 
    });
    
    await refetch();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton to="/dashboard" />
              <Logo showText={false} />
              <div>
                <h1 className="text-xl font-bold">{project.title}</h1>
                <p className="text-sm text-muted-foreground">{project.tasks.length} tasks • {project.progress || 0}% complete</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-accent/20">
                <Focus className="w-4 h-4 mr-2" />
                Focus View
              </Button>
              
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-accent/20">
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 mb-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Project Overview</h3>
                <div className="space-y-4">
                  {project.deadline && (
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold text-primary">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-primary to-sky-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
                    <div className="flex justify-between mb-1">
                      <span>Total tasks:</span>
                      <span className="font-semibold">{project.tasks.length}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Completed:</span>
                      <span className="font-semibold text-success-green">{project.tasks.filter(t => t.completed).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-semibold text-primary">{project.tasks.filter(t => !t.completed).length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-primary to-sky-blue-600 hover:from-primary/90 hover:to-sky-blue-600/90 rounded-2xl h-14 font-semibold text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="rounded-xl h-12"
                  />
                  <Textarea
                    placeholder="Task description (optional)"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="rounded-xl"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated time (minutes)</label>
                    <Input
                      type="number"
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(parseInt(e.target.value) || 60)}
                      className="rounded-xl h-12"
                      min="15"
                      step="15"
                    />
                  </div>
                  <Button 
                    onClick={addTask}
                    className="w-full bg-gradient-to-r from-primary to-sky-blue-600 hover:from-primary/90 hover:to-sky-blue-600/90 rounded-xl h-12 font-semibold"
                    disabled={!newTaskTitle}
                  >
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tasks Timeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Task Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop to schedule tasks
              </p>
            </div>

            {project.tasks.length === 0 ? (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card/50 to-muted/20 text-center py-16">
                <CardContent>
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-3">No tasks yet</h3>
                  <p className="text-muted-foreground mb-6">Break down your project into actionable tasks</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-sky-blue-600 hover:from-primary/90 hover:to-sky-blue-600/90 rounded-2xl px-8 py-3 font-semibold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add First Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {project.tasks.map((task, index) => (
                  <Card 
                    key={task.id} 
                    className={`group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 ${task.completed ? 'opacity-60' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => toggleTaskComplete(task.id, task.completed || false)}
                          className={`w-6 h-6 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all duration-200 ${
                            task.completed 
                              ? 'bg-success-green border-success-green' 
                              : 'border-muted-foreground hover:border-primary hover:scale-110'
                          }`}
                        >
                          {task.completed && (
                            <svg className="w-4 h-4 text-white m-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-lg mb-2 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center bg-muted/50 rounded-lg px-2 py-1">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{formatTime(task.estimated_time || 60)}</span>
                            </div>
                            {task.assigned_date && (
                              <div className="flex items-center bg-primary/10 rounded-lg px-2 py-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{new Date(task.assigned_date).toLocaleDateString()}</span>
                                {task.assigned_time && <span className="ml-1">at {task.assigned_time}</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-muted-foreground mb-2">#{index + 1}</div>
                          {!task.assigned_date && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const today = new Date().toISOString().split('T')[0];
                                const time = '09:00';
                                assignTaskToTimeSlot(task.id, today, time);
                              }}
                              className="text-xs h-8 rounded-xl border-primary/30 hover:bg-primary/10"
                            >
                              Schedule
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectPlanner;
