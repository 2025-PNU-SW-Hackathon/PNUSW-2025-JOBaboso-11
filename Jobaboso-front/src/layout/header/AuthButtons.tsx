import { Link } from 'react-router-dom';

const AuthButtons = () => {
  return (
    <div className="mr-5 flex flex-col items-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
      <Link
        to="/auth/signin"
        className="hover:none text-[20px] font-medium leading-[28px] hover:text-mainBlue"
      >
        로그인
      </Link>
      <Link
        to="/auth/signup/type"
        className="hover:none text-[20px] font-medium leading-[28px] hover:text-mainBlue"
      >
        회원가입
      </Link>
    </div>
  );
};

export default AuthButtons;
