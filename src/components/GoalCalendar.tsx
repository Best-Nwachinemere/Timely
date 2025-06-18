import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface GoalCalendarProps {
  sessions: { date: string; goalName: string }[];
}

const GoalCalendar: React.FC<GoalCalendarProps> = ({ sessions }) => {
  const [value, setValue] = useState<Date>(new Date());

  // Accept both Date and [Date, Date]
  const handleChange = (val: Date | [Date, Date]) => {
    if (Array.isArray(val)) {
      setValue(val[0] || new Date());
    } else {
      setValue(val);
    }
  };

  // Highlight days with sessions
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (
      view === "month" &&
      sessions.some(
        (session) => session.date === date.toISOString().slice(0, 10)
      )
    ) {
      return "bg-primary text-white rounded-full";
    }
    return "";
  };

  return (
    <div className="p-4">
      <Calendar
        onChange={handleChange}
        value={value}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default GoalCalendar;

