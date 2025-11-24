import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import type { Language } from '../types';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'default' | 'mobile';
}

const languages: Record<Language, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  zh: { name: 'Chinese', nativeName: '中文' },
  ar: { name: 'Arabic', nativeName: 'العربية' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  ht: { name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen' },
};

export function LanguageSwitcher({ currentLanguage, onLanguageChange, variant = 'default' }: LanguageSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={variant === 'mobile' ? 'lg' : 'default'} className="tap-target">
          <Globe className="h-5 w-5 mr-2" />
          {languages[currentLanguage].nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(Object.keys(languages) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className="text-large py-3 cursor-pointer"
          >
            <div className="flex flex-col">
              <span>{languages[lang].nativeName}</span>
              <span className="text-sm text-neutral-500">{languages[lang].name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
