import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ProjectPlanner from "./pages/ProjectPlanner";
import DailyFocus from "./pages/DailyFocus";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useNotifications } from './hooks/useNotifications';
import GoalWizard from "@/components/GoalWizard";
import { NotificationService } from "@/services/NotificationService";
import { MotivationService } from "@/services/MotivationService";
import SessionJournal from "@/pages/SessionJournal";
import PublicGoal from "@/pages/PublicGoal";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useNotifications();

  useEffect(() => {
    // Clean up old dark mode settings from localStorage and document
    document.documentElement.classList.remove('dark');
    const settingsRaw = localStorage.getItem('timely_settings');
    if (settingsRaw) {
      try {
        const settings = JSON.parse(settingsRaw);
        if (settings.darkMode !== undefined) {
          delete settings.darkMode;
          localStorage.setItem('timely_settings', JSON.stringify(settings));
        }
      } catch (e) {
        console.error("Failed to parse timely_settings during cleanup", e);
      }
    }
  }, []);

  useEffect(() => {
    NotificationService.init();
  }, []);

  useEffect(() => {
    const fetchMotivation = async () => {
      const msg = await MotivationService.getRandom("preSession");
      console.log(msg);
    };
    fetchMotivation();
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
      />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/project/:id" element={<ProtectedRoute><ProjectPlanner /></ProtectedRoute>} />
      <Route path="/focus" element={<ProtectedRoute><DailyFocus /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route
        path="/goal-wizard"
        element={
          <ProtectedRoute>
            <GoalWizard
              onSave={(goal) => {
                // Assign a unique id if not present
                if (!goal.id) goal.id = Date.now();
                // Save to local storage
                const goals = JSON.parse(localStorage.getItem("goals") || "[]");
                goals.push(goal);
                localStorage.setItem("goals", JSON.stringify(goals));

                // Schedule notifications
                NotificationService.scheduleGoalNotifications({
                  name: goal.name,
                  preferredTimes: goal.timeSlots,
                });

                // Navigate to dashboard
                navigate("/dashboard");
              }}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-journal/:goalId"
        element={
          <ProtectedRoute>
            <SessionJournal />
          </ProtectedRoute>
        }
      />
      <Route path="/public-goal/:goalId" element={<PublicGoal />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;