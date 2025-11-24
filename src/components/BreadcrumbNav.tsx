import { ChevronRight, Home } from 'lucide-react';
import { Button } from './ui/button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-neutral-600">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={items[0]?.onClick}
      >
        <Home className="h-4 w-4" />
      </Button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:text-primary-600"
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          ) : (
            <span className="text-neutral-900 px-2">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
