import React from "react";

const getGoals = () => JSON.parse(localStorage.getItem("goals") || "[]");

const AnalyticsPanel: React.FC = () => {
  const goals = getGoals();

  // Total sessions
  const totalSessions = goals.reduce(
    (sum: number, g: any) => sum + (g.journalNotes?.length || 0),
    0
  );

  // Total goals completed (progress 100%)
  const goalsCompleted = goals.filter((g: any) => g.progress >= 100).length;

  // Average completion rate
  const avgCompletion =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum: number, g: any) => sum + (g.progress || 0), 0) /
            goals.length
        )
      : 0;

  // Most active day
  const allDates = goals.flatMap((g: any) =>
    (g.journalNotes || []).map((n: any) => n.timestamp.slice(0, 10))
  );
  const dayFreq: Record<string, number> = {};
  allDates.forEach((d) => (dayFreq[d] = (dayFreq[d] || 0) + 1));
  const mostActiveDay =
    Object.entries(dayFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <div className="bg-card rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Your Analytics</h2>
      <div className="mb-2">Total sessions: <b>{totalSessions}</b></div>
      <div className="mb-2">Goals completed: <b>{goalsCompleted}</b></div>
      <div className="mb-2">Average completion: <b>{avgCompletion}%</b></div>
      <div className="mb-2">Most active day: <b>{mostActiveDay}</b></div>
    </div>
  );
};

export default AnalyticsPanel;