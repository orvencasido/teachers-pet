import React from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Calendar as CalendarIcon,
  BookOpen,
  ChevronDown,
  Plus,
} from 'lucide-react';
import type { ClassItem } from '../../types';

export type TabKey = 'students' | 'gradebook' | 'calendar' | 'lessons';

interface NavbarProps {
  classes: ClassItem[];
  selectedClassId: string | null;
  selectedClass: ClassItem | null;
  onSelectClass: (id: string) => void;
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenNewClass: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  classes,
  selectedClassId,
  selectedClass,
  onSelectClass,
  activeTab,
  onSelectTab,
  onOpenNewClass,
}) => {
  const tabs = [
    { key: 'students' as TabKey, label: 'Students', icon: Users },
    { key: 'gradebook' as TabKey, label: 'Gradebook', icon: Award },
    { key: 'calendar' as TabKey, label: 'Calendar', icon: CalendarIcon },
    { key: 'lessons' as TabKey, label: 'Lesson Plans', icon: BookOpen },
  ];

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand row */}
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-semibold text-zinc-100 tracking-tight text-base sm:text-lg block leading-none">
                  Teacher&apos;s Pet
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Faculty Suite</span>
              </div>
            </div>

            {/* Class switcher dropdown */}
            <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-zinc-800">
              <div className="relative inline-block text-left">
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedClassId ?? ''}
                    onChange={(e) => onSelectClass(e.target.value)}
                    className="appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-[200px] sm:max-w-[280px] truncate font-medium"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.subject})
                      </option>
                    ))}
                    {classes.length === 0 && <option value="">No classes found</option>}
                  </select>
                  <ChevronDown className="h-4 w-4 text-zinc-400 absolute right-2 pointer-events-none" />
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenNewClass}
                title="Create a new class"
                className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Add Class</span>
              </button>
            </div>
          </div>

          {/* Quick status pill for current class */}
          {selectedClass && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400">
              <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800/80">
                Grade {selectedClass.grade_level} • Sec {selectedClass.section}
              </span>
              <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800/80">
                {selectedClass.school_year}
              </span>
            </div>
          )}
        </div>

        {/* Tab Navigation row */}
        <div className="flex space-x-1 sm:space-x-4 border-t border-zinc-800/60 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-900 text-indigo-400 border border-zinc-700/80 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
