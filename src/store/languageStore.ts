import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLanguage = 'BN' | 'EN' | 'HI';

interface LanguageStore {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'EN', // Default language set to English
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((state) => ({
          language: state.language === 'BN' ? 'EN' : state.language === 'EN' ? 'HI' : 'BN',
        })),
    }),
    {
      name: 'language-store',
    }
  )
);
