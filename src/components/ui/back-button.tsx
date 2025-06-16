
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

interface BackButtonProps {
  to?: string;
  className?: string;
}

export const BackButton = ({ to, className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleClick}
      className={`rounded-xl hover:bg-accent/20 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
    </Button>
  );
};
