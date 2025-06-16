
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { BackButton } from '@/components/ui/back-button';
import { useProjects } from '@/hooks/useProjects';
import { Calendar, ArrowRight, Target, Sparkles, Clock } from 'lucide-react';

const Onboarding = () => {
  const [goalTitle, setGoalTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [goalType, setGoalType] = useState<'one-time' | 'daily' | 'recurring'>('one-time');
  const [dailyTime, setDailyTime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createProject } = useProjects();

  const starterGoals = [
    "Launch my first app",
    "Complete my thesis project", 
    "Build a personal website",
    "Learn a new programming language",
    "Save $6,000 for a car",
    "Run a marathon",
    "Take my blockchain course daily",
    "Read for 1 hour each day"
  ];

  const handleGoalSubmit = async () => {
    if (!goalTitle.trim()) return;

    setLoading(true);
    
    try {
      const projectData = {
        title: goalTitle.trim(),
        deadline: deadline || null,
        deadline_time: deadlineTime || null,
        goal_type: goalType,
        daily_time: dailyTime || null,
        progress: 0,
        description: '',
        total_estimated_hours: 0
      };

      const newProject = await createProject(projectData);
      
      if (newProject) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStarterGoal = (goal: string) => {
    setGoalTitle(goal);
    // Set default type based on goal content
    if (goal.includes('daily') || goal.includes('each day')) {
      setGoalType('daily');
      setDailyTime('09:00'); // Default time
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <BackButton to="/dashboard" />
          <div className="flex-1 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-4 shadow-2xl">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Create New Project
            </h1>
            <p className="text-muted-foreground font-medium">Your time. Seen.</p>
          </div>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        <Card className="animate-slide-up border-0 shadow-2xl bg-card/90 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2">What's your big goal?</h2>
                <p className="text-muted-foreground">We'll help you break it into doable pieces</p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Build my dream project"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="h-14 border-border focus:border-primary rounded-2xl text-lg"
                />

                {/* Goal Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground">Goal Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={goalType === 'one-time' ? 'default' : 'outline'}
                      onClick={() => setGoalType('one-time')}
                      className="rounded-xl text-xs"
                    >
                      One-time
                    </Button>
                    <Button
                      type="button"
                      variant={goalType === 'daily' ? 'default' : 'outline'}
                      onClick={() => setGoalType('daily')}
                      className="rounded-xl text-xs"
                    >
                      Daily
                    </Button>
                    <Button
                      type="button"
                      variant={goalType === 'recurring' ? 'default' : 'outline'}
                      onClick={() => setGoalType('recurring')}
                      className="rounded-xl text-xs"
                    >
                      Recurring
                    </Button>
                  </div>
                </div>

                {/* Deadline Section */}
                {goalType !== 'daily' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-semibold">Deadline (optional)</label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="h-12 border-border focus:border-primary rounded-xl"
                      />
                      <Input
                        type="time"
                        value={deadlineTime}
                        onChange={(e) => setDeadlineTime(e.target.value)}
                        className="h-12 border-border focus:border-primary rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* Daily Time Section */}
                {goalType === 'daily' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-semibold">Preferred time</label>
                    </div>
                    <Input
                      type="time"
                      value={dailyTime}
                      onChange={(e) => setDailyTime(e.target.value)}
                      className="h-12 border-border focus:border-primary rounded-xl"
                      placeholder="e.g., 15:00 for 3 PM"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">Or try a starter goal:</p>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {starterGoals.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => handleStarterGoal(goal)}
                        className="text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-accent/10 transition-all text-sm font-medium hover:shadow-lg"
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={handleGoalSubmit}
                  disabled={!goalTitle.trim() || loading}
                  className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-2xl font-semibold text-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      Create my project
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
