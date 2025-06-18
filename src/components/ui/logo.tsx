import React from "react";
import { Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <Link 
      to="/dashboard" 
      className={`flex items-center space-x-3 hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-sky-blue-600 rounded-xl flex items-center justify-center shadow-lg">
        <Target className="w-5 h-5 text-white" />
      </div>
      {showText && (
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-sky-blue-600 bg-clip-text text-transparent">
            Timely
          </h1>
          <p className="text-xs text-muted-foreground font-medium">Your time. Seen.</p>
        </div>
      )}
    </Link>
  );
};

const EmojiLogo = () => (
  <span
    style={{
      display: "inline-block",
      fontSize: "2.5rem",
      animation: "bounce 1s infinite alternate",
    }}
    role="img"
    aria-label="meh"
  >
    😑
    <style>
      {`
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}
    </style>
  </span>
);

export default EmojiLogo;
