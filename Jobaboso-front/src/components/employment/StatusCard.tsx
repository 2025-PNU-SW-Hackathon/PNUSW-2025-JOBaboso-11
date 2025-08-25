import React from 'react';
import type { SVGProps, ReactElement } from 'react';

interface StatusCardProps {
  icon: ReactElement<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ icon, label, value }) => {
  const styledIcon = React.cloneElement(icon, {
    className: `${icon.props.className ?? ''} w-8 h-8`,
  });

  return (
    <div className="flex h-[156px] w-full flex-col justify-between rounded-[16px] border border-gray-100 px-6 py-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2 text-h2 text-gray-700">
        {styledIcon}
        {label}
      </div>
      <div className="flex h-full items-end justify-end">
        <span className="text-[40px] font-semibold text-gray-700">{value}</span>
      </div>
    </div>
  );
};
