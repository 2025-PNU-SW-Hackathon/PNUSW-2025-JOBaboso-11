import { Link, useLocation } from 'react-router-dom';

interface ProfileSectionProps {
  userName: string;
  userType: string | null;
}

const ProfileSection = ({ userName, userType }: ProfileSectionProps) => {
  const location = useLocation();
  const isMyPage = location.pathname.startsWith('/my');

  const profileButton = (
    <button
      className={`flex items-center justify-center rounded-full transition-colors ${
        isMyPage ? 'border-mainBlue' : 'border-gray-300 hover:border-mainBlue'
      }`}
      aria-label="프로필"
    >
      <img src="/ic_profile.svg" alt="프로필" className="h-7 w-7" />
    </button>
  );

  const userNameSpan = (
    <span
      className={`mr-16 text-[20px] font-medium leading-[28px] transition-colors ${
        isMyPage ? 'text-mainBlue' : 'text-gray-700'
      }`}
    >
      {userName}
    </span>
  );

  if (userType === 'personal') {
    return (
      <Link to="/my/spec" className="flex items-center gap-2 p-1 hover:opacity-80">
        {profileButton}
        {userNameSpan}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 p-1">
      {profileButton}
      {userNameSpan}
    </div>
  );
};

export default ProfileSection;
