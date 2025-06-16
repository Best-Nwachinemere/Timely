
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIService } from '@/services/AIService';

interface DailyEncouragementProps {
  userName: string;
  projects: any[];
}

export const DailyEncouragement = ({ userName, projects }: DailyEncouragementProps) => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateMessage = async () => {
    setLoading(true);
    try {
      const encouragement = await AIService.generateDailyEncouragement(userName, projects);
      setMessage(encouragement);
    } catch (error) {
      console.error('Error generating encouragement:', error);
      setMessage(`Keep pushing forward, ${userName}! Every small step counts toward your goals.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateMessage();
  }, [userName, projects.length]);

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 mb-8">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-2 font-accent">Daily Encouragement</h3>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-primary/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-primary/20 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed">{message}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateMessage}
            disabled={loading}
            className="ml-4 rounded-xl hover:bg-primary/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
