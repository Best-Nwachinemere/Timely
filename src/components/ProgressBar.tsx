import React from "react";

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-muted rounded-full h-3 mb-2">
    <div
      className="bg-primary h-3 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default ProgressBar;