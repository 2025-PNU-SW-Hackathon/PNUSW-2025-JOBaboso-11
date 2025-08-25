import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLikesList, deleteLike } from '../../apis/company';
import { LikeItem } from '../../type/emp';
import { Callout } from '../../components/common/Callout';
import SearchInput from '../../components/common/SearchInput';
import LikeUserCard from '../../components/company/LikeUserCard';

const CompanyLikesCollectPage: React.FC = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await getLikesList(1, 24);
      setLikes(response.likes);
    } catch (error) {
      console.error('Error fetching likes:', error);
      // API 호출 실패 시 빈 배열로 설정
      setLikes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (likeId: string | number) => {
    try {
      await deleteLike(Number(likeId));
      alert('찜하기가 취소되었습니다!');
      // 찜한 항목을 목록에서 제거
      setLikes((prevLikes) => prevLikes.filter((like) => like.id !== Number(likeId)));
    } catch (error) {
      console.error('Error deleting like:', error);
      alert('찜하기 취소에 실패했습니다.');
    }
  };

  const handleCardClick = (likeId: string | number) => {
    // like.target_user_id를 사용하여 specpage로 이동
    navigate(`/company/spec/${likeId}`);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center">로딩 중...</div>;
  }

  return (
    <div>
      {/* 정보 박스 */}
      <div className="mb-6">
        <Callout text="김민정 님께서 찜하신 지원자들을 아래에 모아볼 수 있습니다." />
      </div>

      {/* 검색 바 */}
      <div className="mb-8 flex-1">
        <SearchInput
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="키워드를 자유롭게 입력해보세요."
          className="w-full"
        />
      </div>

      {/* 찜한 사용자 카드 그리드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {likes.map((like) => (
          <LikeUserCard
            key={like.id}
            like={like}
            onUnlike={handleUnlike}
            onClick={() => handleCardClick(like.target_user_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyLikesCollectPage;
