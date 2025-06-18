import React, { useState } from "react";
import { goalTemplates } from "@/data/goalTemplates";

type Frequency = "daily" | "weekly";

interface GoalData {
  name: string;
  description: string;
  durationMonths: number;
  frequency: Frequency;
  timeSlots: string[]; // e.g., ["08:00", "18:00"]
}

const initialGoal: GoalData = {
  name: "",
  description: "",
  durationMonths: 1,
  frequency: "daily",
  timeSlots: [],
};

const GoalWizard: React.FC<{ onSave: (goal: GoalData) => void }> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<GoalData>(initialGoal);
  const [templateSelected, setTemplateSelected] = useState(false);

  // Handlers for each step
  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  // Helper to get suggested times
  const getSuggestedTimes = () => {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    const allTimes = goals.flatMap((g: any) => g.timeSlots || []);
    const freq: Record<string, number> = {};
    allTimes.forEach((t: string) => (freq[t] = (freq[t] || 0) + 1));
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    // Return top 2 most common, or fallback to defaults
    return sorted.length > 0
      ? sorted.slice(0, 2).map(([t]) => t)
      : ["08:00", "18:00"];
  };

  // After user enters goal name/description:
  const autoSuggestCadence = (goalName: string) => {
    const lower = goalName.toLowerCase();
    if (lower.includes("read") || lower.includes("exercise") || lower.includes("meditate")) {
      return "daily";
    }
    if (lower.includes("project") || lower.includes("review")) {
      return "weekly";
    }
    return "daily";
  };

  // If no template is selected, show template options
  if (!templateSelected) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Start with a template?</h2>
        <div className="grid gap-4">
          {goalTemplates.map((tpl, idx) => (
            <button
              key={idx}
              className="bg-muted p-4 rounded-lg text-left hover:bg-accent transition"
              onClick={() => {
                setGoal({
                  ...goal,
                  name: tpl.name,
                  description: tpl.description,
                  durationMonths: tpl.durationMonths,
                  frequency: tpl.cadence,
                  timeSlots: tpl.timeSlots,
                });
                setTemplateSelected(true);
                setStep(1); // Move to step 1 with pre-filled values
              }}
            >
              <div className="font-semibold">{tpl.name}</div>
              <div className="text-xs text-muted-foreground">{tpl.description}</div>
            </button>
          ))}
        </div>
        <button
          className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          onClick={() => setTemplateSelected(true)}
        >
          Start from scratch
        </button>
      </div>
    );
  }

  // Step 1: Name & Description
  if (step === 1) {
    return (
      <div>
        <h2>Step 1: Name your goal</h2>
        <input
          type="text"
          placeholder="Goal name"
          value={goal.name}
          onChange={(e) => setGoal({ ...goal, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={goal.description}
          onChange={(e) => setGoal({ ...goal, description: e.target.value })}
        />
        <button disabled={!goal.name} onClick={handleNext}>Next</button>
      </div>
    );
  }

  // Step 2: Duration
  if (step === 2) {
    return (
      <div>
        <h2>Step 2: How many months?</h2>
        <select
          value={goal.durationMonths}
          onChange={(e) => setGoal({ ...goal, durationMonths: Number(e.target.value) })}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} month{i === 0 ? "" : "s"}</option>
          ))}
        </select>
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    );
  }

  // Step 3: Frequency
  if (step === 3) {
    return (
      <div>
        <h2>Step 3: How often do you want to commit?</h2>
        <select
          value={goal.frequency}
          onChange={(e) => setGoal({ ...goal, frequency: e.target.value as Frequency })}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    );
  }

  // Step 4: Time slots
  if (step === 4) {
    const addTimeSlot = (slot: string) => {
      if (!goal.timeSlots.includes(slot)) {
        setGoal({ ...goal, timeSlots: [...goal.timeSlots, slot] });
      }
    };
    const removeTimeSlot = (slot: string) => {
      setGoal({ ...goal, timeSlots: goal.timeSlots.filter((t) => t !== slot) });
    };
    return (
      <div>
        <h2>Step 4: Pick time(s) in your day</h2>
        <input
          type="time"
          onChange={(e) => addTimeSlot(e.target.value)}
        />
        <div>
          {goal.timeSlots.map((slot) => (
            <span key={slot}>
              {slot} <button onClick={() => removeTimeSlot(slot)}>x</button>
            </span>
          ))}
        </div>
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">Suggested times: </span>
          {getSuggestedTimes().map((t) => (
            <button
              key={t}
              className="bg-muted px-2 py-1 rounded mx-1"
              onClick={() => addTimeSlot(t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={handleBack}>Back</button>
        <button disabled={goal.timeSlots.length === 0} onClick={handleNext}>Next</button>
      </div>
    );
  }

  // Step 5: Summary
  if (step === 5) {
    return (
      <div>
        <h2>Summary</h2>
        <p>
          Your goal to <b>{goal.name}</b> is set for the next <b>{goal.durationMonths}</b> month{goal.durationMonths > 1 ? "s" : ""}.
        </p>
        <p>Frequency: <b>{goal.frequency}</b></p>
        <p>Time(s): <b>{goal.timeSlots.join(", ")}</b></p>
        <button onClick={handleBack}>Back</button>
        <button
          onClick={() => {
            onSave(goal);
            // Optionally navigate to dashboard here
          }}
        >
          Save & Go!
        </button>
      </div>
    );
  }

  return null;
};

export default GoalWizard;