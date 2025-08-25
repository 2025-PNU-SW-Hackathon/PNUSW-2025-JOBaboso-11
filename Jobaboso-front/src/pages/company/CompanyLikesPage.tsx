import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomPersonalUsers, createLike } from '../../apis/company';
import { PersonalUser } from '../../type/emp';
import { Callout } from '../../components/common/Callout';
import SearchInput from '../../components/common/SearchInput';

import UserCard from '../../components/company/UserCard';

const CompanyLikesPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<PersonalUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getRandomPersonalUsers(6);
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      // API 호출 실패 시 빈 배열로 설정
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (
    userId: string | number,
    likeData: {
      message: string;
      contact_email: string;
      contact_phone: string;
      suggested_position: string;
    }
  ) => {
    try {
      await createLike({
        target_user_id: String(userId),
        message: likeData.message,
        contact_email: likeData.contact_email,
        contact_phone: likeData.contact_phone,
        suggested_position: likeData.suggested_position,
      });
      // 찜하기 성공 후 사용자 목록에서 제거하거나 상태 업데이트
      alert('찜하기가 완료되었습니다!');
      // 찜한 사용자를 목록에서 제거
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== String(userId)));
    } catch (error) {
      console.error('Error creating like:', error);
      alert('찜하기에 실패했습니다.');
    }
  };

  const handleCardClick = (userId: string | number) => {
    // user_id를 그대로 사용 (예: "personal01" -> "personal01")
    navigate(`/company/spec/${userId}`);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center">로딩 중...</div>;
  }

  return (
    <div>
      {/* 정보 박스 */}
      <div className="mb-6">
        <Callout text="원하는 인재를 찜해 입사까지 이어지게 할 수 있어요. 아래 리스트를 보고 원하는 인재를 찜해보세요!" />
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-8 flex-1">
        <SearchInput
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="키워드를 자유롭게 입력해보세요."
          className="w-full"
        />
      </div>

      {/* 사용자 카드 그리드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard
            key={user.user_id}
            id={user.user_id}
            name={user.name}
            age={user.age}
            gender={user.gender}
            major={user.major}
            job={user.job}
            career_period={user.career_period}
            skills={user.skills}
            onLike={handleLike}
            onClick={() => handleCardClick(user.user_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyLikesPage;
