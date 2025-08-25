import React, { useState, useEffect } from 'react';
import { getMyCompanyLikes } from '../../apis/company';
import { Callout } from '../../components/common/Callout';
import CompanyLikeCard from '../../components/employment/CompanyLikeCard';

interface CompanyLikeData {
  id: number;
  company_id: number;
  company_name: string;
  message: string;
  contact_email: string;
  contact_phone: string;
  suggested_position: string;
  hr_manager_name: string;
  created_at: string;
}

const TouchPage: React.FC = () => {
  const [likes, setLikes] = useState<CompanyLikeData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanyLikes();
  }, []);

  const fetchCompanyLikes = async () => {
    setLoading(true);
    try {
      const response = await getMyCompanyLikes();
      setLikes(response.likes || []);
    } catch (error) {
      console.error('Error fetching company likes:', error);
      setLikes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center">로딩 중...</div>;
  }

  return (
    <>
      <Callout text="기업으로부터 찜 제안을 받으면 이곳에 표시됩니다. 찜 제안을 받으면, 기업 담당자와 가능한 빨리 컨택하시는 걸 추천드려요. ☺️" />
      <h2 className="mb-2 mt-8 text-h2 font-bold text-gray-800">찜 제안</h2>
      <p className="text-body mb-6 text-gray-600">총 {likes.length}건</p>

      {/* 찜 제안 카드 그리드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {likes.map((like) => (
          <CompanyLikeCard
            key={like.id}
            like={like}
            onClick={() => {
              // 카드 클릭 시 처리 (필요시 추가)
              console.log('Clicked like:', like);
            }}
          />
        ))}
      </div>

      {likes.length === 0 && (
        <div className="flex h-32 items-center justify-center text-gray-500">
          아직 받은 찜 제안이 없습니다.
        </div>
      )}
    </>
  );
};

export default TouchPage;
