import { Link, useLocation } from 'react-router-dom';

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  pathPrefix?: string;
}

const NavigationLink = ({ to, children, pathPrefix }: NavigationLinkProps) => {
  const location = useLocation();
  const isActive = pathPrefix ? location.pathname.startsWith(pathPrefix) : location.pathname === to;

  return (
    <Link
      to={to}
      className={`text-[20px] font-medium leading-[28px] transition-colors ${
        isActive ? 'text-mainBlue' : 'text-gray-700 hover:text-mainBlue'
      }`}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;
