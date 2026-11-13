import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { TranslationSchema } from '../i18n/translations';
import { AppLanguage, AppPreferences, DarkSurfacePreset } from '../types/app';

interface SettingsScreenProps {
  t: TranslationSchema;
  preferences: AppPreferences;
  surfaceClass: string;
  elevatedClass: string;
  onSetLanguage: (lang: AppLanguage) => void;
  onSetDarkSurface: (preset: DarkSurfacePreset) => void;
  onUpdatePreferences: (partial: Partial<AppPreferences>) => void;
  onReplaySplash: () => void;
  onResetStorage: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  t,
  preferences,
  surfaceClass,
  elevatedClass,
  onSetLanguage,
  onSetDarkSurface,
  onUpdatePreferences,
  onReplaySplash,
  onResetStorage,
}) => {
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  return (
    <div className="space-y-5 p-4 pb-8">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#F5F3FF]">
          {t.settings.headerTitle}
        </h2>
        <p className="text-xs text-[#8B7FA8]">{t.settings.headerSubtitle}</p>
      </div>

      {/* Language Selector */}
      <section className="space-y-2">
        <p className="text-xs font-bold text-violet-300 px-1">
          {t.settings.languageSection}
        </p>
        <div
          className={`rounded-3xl border border-violet-300/15 ${surfaceClass} p-4 space-y-3`}
        >
          <div>
            <p className="text-sm font-bold text-[#F5F3FF]">
              {t.settings.languageTitle}
            </p>
            <p className="text-xs text-[#8B7FA8] mt-0.5">
              {t.settings.languageDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onSetLanguage('hi')}
              className={`min-h-[46px] rounded-xl border text-xs font-semibold px-2 transition-colors cursor-pointer ${
                preferences.language === 'hi'
                  ? 'bg-violet-600 border-purple-400 text-white'
                  : `${elevatedClass} border-violet-300/15 text-[#8B7FA8]`
              }`}
            >
              {t.settings.hindiOption}
            </button>
            <button
              type="button"
              onClick={() => onSetLanguage('en')}
              className={`min-h-[46px] rounded-xl border text-xs font-semibold px-2 transition-colors cursor-pointer ${
                preferences.language === 'en'
                  ? 'bg-violet-600 border-purple-400 text-white'
                  : `${elevatedClass} border-violet-300/15 text-[#8B7FA8]`
              }`}
            >
              {t.settings.englishOption}
            </button>
          </div>
        </div>
      </section>

      {/* Dark Theme */}
      <section className="space-y-2">
        <p className="text-xs font-bold text-violet-300 px-1">
          {t.settings.themeSection}
        </p>
        <div
          className={`rounded-3xl border border-violet-300/15 ${surfaceClass} p-4 space-y-3`}
        >
          <div>
            <p className="text-sm font-bold text-[#F5F3FF]">{t.settings.themeTitle}</p>
            <p className="text-xs text-[#8B7FA8] mt-0.5">{t.settings.themeDesc}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onSetDarkSurface('obsidian')}
              className={`min-h-[46px] rounded-xl border text-xs font-semibold px-2 transition-colors cursor-pointer ${
                preferences.darkSurface === 'obsidian'
                  ? 'bg-violet-600 border-purple-400 text-white'
                  : `${elevatedClass} border-violet-300/15 text-[#8B7FA8]`
              }`}
            >
              {t.settings.themeObsidian}
            </button>
            <button
              type="button"
              onClick={() => onSetDarkSurface('amethyst')}
              className={`min-h-[46px] rounded-xl border text-xs font-semibold px-2 transition-colors cursor-pointer ${
                preferences.darkSurface === 'amethyst'
                  ? 'bg-violet-600 border-purple-400 text-white'
                  : `${elevatedClass} border-violet-300/15 text-[#8B7FA8]`
              }`}
            >
              {t.settings.themeAmethyst}
            </button>
          </div>
        </div>
      </section>

      {/* Personal Preferences */}
      <section className="space-y-2">
        <p className="text-xs font-bold text-violet-300 px-1">
          {t.settings.preferencesSection}
        </p>
        <div
          className={`rounded-3xl border border-violet-300/15 ${surfaceClass} p-4 space-y-3.5`}
        >
          <ToggleRow
            title={t.settings.autoSaveTitle}
            description={t.settings.autoSaveDesc}
            checked={preferences.autoSaveDrafts}
            onChange={(val) => onUpdatePreferences({ autoSaveDrafts: val })}
          />
          <div className="h-px bg-violet-300/10" />
          <ToggleRow
            title={t.settings.placeholdersTitle}
            description={t.settings.placeholdersDesc}
            checked={preferences.showStarterPlaceholders}
            onChange={(val) => onUpdatePreferences({ showStarterPlaceholders: val })}
          />
          <div className="h-px bg-violet-300/10" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#F5F3FF]">
                {t.settings.replaySplashTitle}
              </p>
              <p className="text-xs text-[#8B7FA8]">{t.settings.replaySplashDesc}</p>
            </div>
            <button
              type="button"
              onClick={onReplaySplash}
              className="min-h-[40px] px-3 rounded-xl border border-violet-400/30 bg-violet-600/15 text-xs font-semibold text-violet-200 flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{t.settings.replaySplashAction}</span>
            </button>
          </div>
          <div className="h-px bg-violet-300/10" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#F5F3FF]">
                {t.settings.clearStorageTitle}
              </p>
              <p className="text-xs text-[#8B7FA8]">{t.settings.clearStorageDesc}</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="min-h-[40px] px-3.5 rounded-xl border border-red-400/35 bg-red-500/15 text-xs font-semibold text-red-300 cursor-pointer shrink-0 whitespace-nowrap"
            >
              {t.settings.clearStorageAction}
            </button>
          </div>
        </div>
      </section>

      {/* App Info */}
      <section className="space-y-2">
        <p className="text-xs font-bold text-violet-300 px-1">
          {t.settings.appInfoSection}
        </p>
        <div
          className={`rounded-3xl border border-violet-300/15 ${surfaceClass} p-4 space-y-2.5`}
        >
          <InfoLine label={t.settings.appNameLabel} value="TUKKU-CREATION" />
          <div className="h-px bg-violet-300/10" />
          <InfoLine label={t.settings.packageLabel} value="com.tukku.creation" mono />
          <div className="h-px bg-violet-300/10" />
          <InfoLine label={t.settings.platformLabel} value="Android (Expo / React Native)" />
          <div className="h-px bg-violet-300/10" />
          <InfoLine label={t.settings.usageLabel} value={t.settings.usageValue} />
          <div className="h-px bg-violet-300/10" />
          <InfoLine label={t.settings.phaseLabel} value={t.settings.phaseValue} />
        </div>
      </section>

      {confirmResetOpen ? (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-5">
          <div
            className={`w-full max-w-[310px] rounded-2xl border border-violet-300/25 ${surfaceClass} p-5 space-y-3 shadow-2xl`}
          >
            <h4 className="text-base font-bold text-[#F5F3FF]">
              {t.settings.confirmClearTitle}
            </h4>
            <p className="text-xs text-[#C4B5FD] leading-relaxed">
              {t.settings.confirmClearBody}
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="min-h-[42px] rounded-xl border border-violet-300/20 text-xs font-semibold text-violet-200 cursor-pointer"
              >
                {t.projects.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetStorage();
                  setConfirmResetOpen(false);
                }}
                className="min-h-[42px] rounded-xl bg-red-500/20 border border-red-400/40 text-xs font-bold text-red-300 cursor-pointer"
              >
                {t.settings.clearStorageAction}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ToggleRow: React.FC<{
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}> = ({ title, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-[#F5F3FF]">{title}</p>
      <p className="text-xs text-[#8B7FA8]">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
        checked ? 'bg-violet-600' : 'bg-[#2A223D]'
      }`}
    >
      <span
        className={`block w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const InfoLine: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className="text-[#8B7FA8]">{label}</span>
    <span
      className={`text-right font-semibold ${
        mono ? 'font-mono text-violet-300' : 'text-[#F5F3FF]'
      }`}
    >
      {value}
    </span>
  </div>
);
