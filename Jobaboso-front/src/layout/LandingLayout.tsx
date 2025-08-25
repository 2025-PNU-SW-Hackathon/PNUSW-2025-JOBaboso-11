import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const LandingLayout: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // user_type 확인
    const type = localStorage.getItem('user_type');
    setUserType(type);

    if (type === 'company') {
      navigate('/company/contents');
    } else if (type === 'university_staff') {
      navigate('/staff/department');
    }
    else if (type === 'personal') {
      navigate('/home');
    }
  }, [navigate]);
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
};

export default LandingLayout;
