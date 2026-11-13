import React from 'react';
import { FolderKanban, Home, LayoutGrid, PlusCircle, Settings } from 'lucide-react';
import { TabKey } from '../types/app';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  labels: {
    home: string;
    create: string;
    projects: string;
    tools: string;
    settings: string;
  };
  surfaceClass: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  labels,
  surfaceClass,
}) => {
  const items: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'Home', label: labels.home, icon: <Home className="w-[21px] h-[21px]" /> },
    { key: 'Create', label: labels.create, icon: <PlusCircle className="w-[21px] h-[21px]" /> },
    {
      key: 'MyProjects',
      label: labels.projects,
      icon: <FolderKanban className="w-[21px] h-[21px]" />,
    },
    { key: 'AITools', label: labels.tools, icon: <LayoutGrid className="w-[21px] h-[21px]" /> },
    { key: 'Settings', label: labels.settings, icon: <Settings className="w-[21px] h-[21px]" /> },
  ];

  return (
    <nav
      aria-label="Primary Android Bottom Navigation"
      className={`shrink-0 grid grid-cols-5 border-t border-violet-300/15 ${surfaceClass} px-1 pt-1.5 pb-2`}
    >
      {items.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelectTab(item.key)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer px-1 ${
              isActive
                ? 'text-[#F5F3FF]'
                : 'text-[#8B7FA8] hover:text-violet-200'
            }`}
          >
            <span
              className={`transition-transform duration-150 ${
                isActive ? 'text-purple-400 scale-105' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold tracking-tight leading-none whitespace-nowrap truncate max-w-full">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
