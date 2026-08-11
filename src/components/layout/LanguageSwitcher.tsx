'use client';

import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguageStore, AppLanguage } from '@/store/languageStore';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLanguageLabel = (lang: AppLanguage) => {
    switch (lang) {
      case 'BN':
        return 'বাংলা';
      case 'HI':
        return 'हिंदी';
      case 'EN':
      default:
        return 'English';
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="h-9 px-3 rounded-full font-black text-xs border-amber-400/50">
        <Globe className="h-3.5 w-3.5 text-amber-500 mr-1" />
        <span>বাংলা</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-full font-black text-xs border-amber-400/60 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-slate-900 dark:text-amber-300 gap-1.5 shadow-sm transition-all"
          aria-label="Select Language"
        >
          <Globe className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>{getLanguageLabel(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 font-bold text-xs p-1">
        <DropdownMenuItem
          onClick={() => setLanguage('BN')}
          className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md focus:bg-amber-500/10 focus:text-amber-600"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">🇧🇩</span> বাংলা (Bengali)
          </span>
          {language === 'BN' && <Check className="h-3.5 w-3.5 text-amber-500" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage('HI')}
          className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md focus:bg-amber-500/10 focus:text-amber-600"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">🇮🇳</span> हिंदी (Hindi)
          </span>
          {language === 'HI' && <Check className="h-3.5 w-3.5 text-amber-500" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage('EN')}
          className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md focus:bg-amber-500/10 focus:text-amber-600"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">🇬🇧</span> English (EN)
          </span>
          {language === 'EN' && <Check className="h-3.5 w-3.5 text-amber-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
