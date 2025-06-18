import React from "react";
import { useParams } from "react-router-dom";

const PublicGoal: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const goals = JSON.parse(localStorage.getItem("goals") || "[]");
  const goal = goals.find((g: any) => String(g.id) === String(goalId));

  if (!goal) return <div>Goal not found.</div>;

  return (
    <div className="max-w-lg mx-auto mt-12 bg-card p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">{goal.name}</h2>
      <p className="mb-2">{goal.description}</p>
      <div className="mb-2">Progress: {goal.progress}%</div>
      <div className="mb-2">Streak: {goal.streak} days</div>
      <div>
        Achievements:{" "}
        {goal.achievements && goal.achievements.length > 0
          ? goal.achievements.join(", ")
          : "None yet"}
      </div>
    </div>
  );
};

export default PublicGoal;