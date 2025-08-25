import { ReactNode } from 'react';

interface CardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

const Card = ({ icon, title, description, children }: CardProps) => {
  return (
    <div className="flex h-[345px] w-[370px] flex-col gap-6 rounded-[32px] border border-gray-50 bg-white p-[36px] shadow">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center text-4xl text-mainBlue">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-h2 text-gray-700">{title}</h3>
        <p className="text-bodyLg text-gray-700">{description}</p>
      </div>

      {children && <div className="ml-[187px] mt-[42px]">{children}</div>}
    </div>
  );
};

export default Card;
