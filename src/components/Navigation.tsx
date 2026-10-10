import React from 'react';
import { LayoutGrid, ShoppingBag, Map, BookOpen } from 'lucide-react';
import { Player } from '../types/game';

export type ActiveTab = 'board' | 'inventory' | 'map' | 'rules';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activePlayer: Player;
  language: 'vi' | 'en';
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  activePlayer,
  language
}) => {
  const totalCards = 
    (activePlayer?.cards?.knowledge?.length || 0) +
    (activePlayer?.cards?.resource?.length || 0) +
    (activePlayer?.cards?.fortune?.length || 0);

  const tabs: { id: ActiveTab; label: string; enLabel: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'board',
      label: 'Bàn chơi',
      enLabel: 'Board',
      icon: <LayoutGrid size={20} />
    },
    {
      id: 'inventory',
      label: 'Túi',
      enLabel: 'Bag',
      icon: <ShoppingBag size={20} />,
      badge: totalCards > 0 ? totalCards : undefined
    },
    {
      id: 'map',
      label: 'Bản đồ',
      enLabel: 'Map',
      icon: <Map size={20} />
    },
    {
      id: 'rules',
      label: 'Luật',
      enLabel: 'Rules',
      icon: <BookOpen size={20} />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#C5A059]/40 shadow-lg">
      <div className="max-w-xl mx-auto flex items-center justify-around px-2 py-1.5 sm:py-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 sm:px-5 rounded-2xl transition-all duration-300 ease-out active:scale-95 ${
                isActive
                  ? 'text-[#7E121D] font-bold'
                  : 'text-gray-500 hover:text-gray-800 hover:-translate-y-0.5'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-[#FAF6EE] text-[#7E121D] shadow-sm border border-[#C5A059]/50 scale-105 shadow-[0_2px_8px_rgba(197,160,89,0.3)]'
                  : 'hover:bg-gray-50'
              }`}>
                {tab.icon}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight transition-colors duration-200 ${isActive ? 'text-[#7E121D] font-bold' : 'font-medium'}`}>
                {language === 'vi' ? tab.label : tab.enLabel}
              </span>

              {/* Badge indicator for cards in bag */}
              {tab.badge !== undefined && (
                <span className="absolute top-0 right-2 sm:right-4 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-badge-bounce">
                  {tab.badge}
                </span>
              )}

              {/* Active line indicator */}
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-0.5 bg-[#7E121D] rounded-full animate-scale-in shadow-[0_0_6px_rgba(126,18,29,0.5)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

