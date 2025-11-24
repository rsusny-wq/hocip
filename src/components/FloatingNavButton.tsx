import { Home } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FloatingNavButtonProps {
  onClick: () => void;
  label?: string;
}

export function FloatingNavButton({ onClick, label = 'Back to Hub' }: FloatingNavButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-primary-600 hover:bg-primary-700 z-50"
            onClick={onClick}
          >
            <Home className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
