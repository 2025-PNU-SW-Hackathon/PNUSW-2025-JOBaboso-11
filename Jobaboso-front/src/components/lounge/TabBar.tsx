import React from 'react';

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange, className = 'mt-4' }) => (
  <div className={className}>
    <div className="flex rounded-t-lg bg-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`h-[70px] w-[248px] rounded-t-lg px-6 py-3 text-h3 transition-colors ${
            activeTab === tab
              ? 'border-x-[1.5px] border-t-[1.5px] border-mainBlue bg-white text-gray-700'
              : 'border-b-[1.5px] border-mainBlue bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default TabBar;
