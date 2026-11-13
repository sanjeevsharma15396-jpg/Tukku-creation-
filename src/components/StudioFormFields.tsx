import React from 'react';
import { AppLanguage } from '../types/app';

export const FieldInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  surfaceClass: string;
}> = ({ id, label, value, onChange, placeholder, surfaceClass }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-bold text-[#F5F3FF]">
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full min-h-[46px] rounded-xl border border-violet-300/15 ${surfaceClass} px-3.5 text-sm text-[#F5F3FF] placeholder:text-[#8B7FA8] focus:outline-none focus:border-violet-400`}
    />
  </div>
);

export const FieldTextArea: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  surfaceClass: string;
  hasError?: boolean;
}> = ({ id, label, value, onChange, placeholder, surfaceClass, hasError = false }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-bold text-[#F5F3FF]">
      {label}
    </label>
    <textarea
      id={id}
      rows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border ${
        hasError ? 'border-red-400/70' : 'border-violet-300/15'
      } ${surfaceClass} px-3.5 py-3 text-sm text-[#F5F3FF] placeholder:text-[#8B7FA8] focus:outline-none focus:border-violet-400 resize-none leading-relaxed`}
    />
  </div>
);

export const OptionChipGroup: React.FC<{
  label: string;
  options: string[];
  selected: string;
  onSelect: (opt: string) => void;
  surfaceClass: string;
}> = ({ label, options, selected, onSelect, surfaceClass }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-bold text-[#F5F3FF]">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`min-h-[40px] px-3.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              active
                ? 'bg-violet-600 border-purple-400 text-white'
                : `${surfaceClass} border-violet-300/15 text-[#8B7FA8] hover:text-violet-200`
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

export const OutputLanguagePicker: React.FC<{
  label: string;
  value: AppLanguage;
  onChange: (lang: AppLanguage) => void;
  surfaceClass: string;
}> = ({ label, value, onChange, surfaceClass }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-bold text-[#F5F3FF]">{label}</p>
    <div className="grid grid-cols-2 gap-2.5">
      {(['hi', 'en'] as AppLanguage[]).map((lang) => {
        const active = value === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              active
                ? 'bg-violet-600/25 border-purple-400 text-[#F5F3FF]'
                : `${surfaceClass} border-violet-300/15 text-[#8B7FA8]`
            }`}
          >
            {lang === 'hi' ? 'हिन्दी' : 'English'}
          </button>
        );
      })}
    </div>
  </div>
);
