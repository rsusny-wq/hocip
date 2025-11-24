import { Home, Heart, Utensils, CreditCard, Droplet, Brain, Briefcase, Scale } from 'lucide-react';
import { Badge } from './ui/badge';
import type { ServiceCategory } from '../types';

interface ServiceBadgeProps {
  category: ServiceCategory;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const serviceConfig: Record<ServiceCategory, { icon: any; label: string; className: string }> = {
  shelter: { icon: Home, label: 'Shelter', className: 'service-badge-shelter' },
  medical: { icon: Heart, label: 'Medical', className: 'service-badge-medical' },
  food: { icon: Utensils, label: 'Food', className: 'service-badge-food' },
  'id-services': { icon: CreditCard, label: 'ID Services', className: 'service-badge-id' },
  detox: { icon: Droplet, label: 'Detox', className: 'service-badge-detox' },
  'mental-health': { icon: Brain, label: 'Mental Health', className: 'service-badge-mental' },
  legal: { icon: Scale, label: 'Legal', className: 'bg-purple-50 text-purple-700' },
  employment: { icon: Briefcase, label: 'Employment', className: 'bg-teal-50 text-teal-700' },
};

export function ServiceBadge({ category, showIcon = true, size = 'md' }: ServiceBadgeProps) {
  const config = serviceConfig[category];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} gap-1.5 border-0`} variant="secondary">
      {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />}
      <span>{config.label}</span>
    </Badge>
  );
}
