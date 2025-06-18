import React from "react";
import ProgressBar from "@/components/ProgressBar";

export interface Goal {
  id: string | number;
  name: string;
  description: string;
  progress: number; // 0 to 100
  streak: number; // number of days for the streak
  achievements: string[]; // array of achievement names
  // ...other fields...
}

const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
  const handleShare = () => {
    const url = `${window.location.origin}/public-goal/${goal.id}`;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="bg-card rounded-xl shadow p-4 mb-4">
      <h3 className="text-lg font-bold">{goal.name}</h3>
      <p className="text-sm text-muted-foreground mb-2">
        {goal.description}
      </p>
      <ProgressBar progress={goal.progress} />
      <span className="text-xs text-muted-foreground">
        {goal.progress}% complete
      </span>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-green-600 font-semibold">
          {" "}
          {goal.streak} day streak
        </span>
        {goal.achievements.map((ach, i) => (
          <span
            key={i}
            className="bg-accent text-xs px-2 py-1 rounded ml-2"
          >
            {ach}
          </span>
        ))}
      </div>
      <button
        className="mt-2 bg-accent text-accent-foreground px-3 py-1 rounded"
        onClick={handleShare}
      >
        Share Progress
      </button>
    </div>
  );
};

export default GoalCard;