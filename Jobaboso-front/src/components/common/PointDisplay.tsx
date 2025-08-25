import { useState, useEffect } from 'react';
import { getPoints } from '@apis/points';

interface PointDisplayProps {
  className?: string;
  onRefresh?: () => void;
}

const PointDisplay: React.FC<PointDisplayProps> = ({ className = '', onRefresh }) => {
  const [points, setPoints] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const pointsData = await getPoints();
      setPoints(pointsData);
    } catch (err) {
      console.error('포인트 조회 실패:', err);
      setError('포인트 조회에 실패했습니다.');
      setPoints('0');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  // 외부에서 포인트 새로고침 요청 시
  useEffect(() => {
    if (onRefresh) {
      const handleRefresh = () => {
        fetchPoints();
      };

      // refreshPoints 함수를 window 객체에 등록
      (window as any).refreshBenchmarkPoints = handleRefresh;

      return () => {
        delete (window as any).refreshBenchmarkPoints;
      };
    }
  }, [onRefresh]);

  if (loading) {
    return (
      <div
        className={`flex items-center rounded-lg border-[1.3px] border-mainBlue bg-subLightBlue px-[12px] py-[8px] ${className}`}
        style={{ width: '180px' }}
      >
        <img src="/ic_point.svg" className="h-[20px] w-[20px]" alt="포인트 아이콘" />
        <div className="ml-[8px] text-bodyMd">보유 포인트</div>
        <div className="ml-[8px] text-h4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center rounded-lg border-[1.3px] border-red-200 bg-red-50 px-[12px] py-[8px] ${className}`}
        style={{ width: '180px' }}
      >
        <img src="/ic_point.svg" className="h-[20px] w-[20px]" alt="포인트 아이콘" />
        <div className="ml-[8px] text-bodyMd text-red-600">포인트 조회 실패</div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center rounded-lg border-[1.3px] border-mainBlue bg-subLightBlue px-[12px] py-[8px] ${className}`}
      style={{ width: '180px' }}
    >
      <img src="/ic_point.svg" className="h-[20px] w-[20px]" alt="포인트 아이콘" />
      <div className="ml-[8px] text-bodyMd">보유 포인트</div>
      <div className="ml-[8px] text-h4">{points}p</div>
    </div>
  );
};

export default PointDisplay;
