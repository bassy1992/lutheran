import React from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as const, label: 'English' },
    { code: 'tw' as const, label: 'Twi' },
    { code: 'ga' as const, label: 'Ga' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-slate-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="px-3 py-1 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
