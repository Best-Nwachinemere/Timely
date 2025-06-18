import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VoiceRecorder from "@/components/VoiceRecorder";

const getGoals = () => JSON.parse(localStorage.getItem("goals") || "[]");
const saveGoals = (goals: any[]) => localStorage.setItem("goals", JSON.stringify(goals));

export interface Goal {
  id: string | number;
  name: string;
  description: string;
  progress: number;
  streak: number; // consecutive days/weeks completed
  achievements: string[]; // e.g., ["7-day streak", "First session"]
  // ...other fields...
}

const SessionJournal: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const [note, setNote] = useState("");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSave = () => {
    const goals = getGoals();
    const idx = goals.findIndex((g: any) => String(g.id) === String(goalId));
    if (idx !== -1) {
      if (!goals[idx].journalNotes) goals[idx].journalNotes = [];
      goals[idx].journalNotes.push({
        text: note,
        timestamp: new Date().toISOString(),
        audio: audioURL || null,
      });

      // Streak and achievement logic
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const lastEntry = goals[idx].journalNotes?.slice(-1)[0];
      const lastDate = lastEntry ? lastEntry.timestamp.slice(0, 10) : null;

      if (lastDate && (new Date(today).getTime() - new Date(lastDate).getTime()) === 24 * 60 * 60 * 1000) {
        goals[idx].streak = (goals[idx].streak || 0) + 1;
      } else if (lastDate !== today) {
        goals[idx].streak = 1;
      }

      // Example achievement logic
      if (goals[idx].streak === 7 && !goals[idx].achievements.includes("7-day streak")) {
        goals[idx].achievements.push("7-day streak");
      }
      if (goals[idx].streak === 1 && !goals[idx].achievements.includes("First session")) {
        goals[idx].achievements.push("First session");
      }

      saveGoals(goals);
    }
    navigate("/dashboard");
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-card p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">How did it go?</h2>
      <textarea
        className="w-full border rounded-lg p-3 mb-4"
        rows={5}
        placeholder="Write your reflection here..."
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <div className="mb-4">
        <VoiceRecorder onStop={setAudioURL} />
      </div>
      <button
        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg"
        disabled={!note.trim() && !audioURL}
        onClick={handleSave}
      >
        Done
      </button>
    </div>
  );
};

export default SessionJournal;