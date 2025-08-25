import React, { useEffect, useMemo, useState } from 'react';
import ReviewCard from '@components/employment/ReviewCard';
import { useNavigate } from 'react-router-dom';
import { deleteJobReview, getJobReview, getMyJobReviews, JobReviewItem } from '@apis/employment';
import { formatDateToKorean } from '@utils/dateUtils';

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<JobReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWrite = () => {
    navigate('/employment/review/write'); // 작성 페이지로 이동
  };

  const handleEdit = (id: number) => {
    navigate(`/employment/review/write?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('해당 후기를 삭제하시겠습니까?')) return;
    try {
      await deleteJobReview(id);
      setReviews((prev) => prev.filter((r) => (r.id ?? -1) !== id));
    } catch (e) {
      console.error(e);
      alert('삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyJobReviews();
        // 각 리뷰의 상세를 병렬로 조회해 내용 채우기
        const detailed = await Promise.all(
          data.map(async (item) => {
            if (item.id != null) {
              try {
                return await getJobReview(item.id);
              } catch {
                return item; // 실패 시 목록 아이템 유지
              }
            }
            return item;
          })
        );
        setReviews(detailed);
      } catch (e) {
        console.error(e);
        setError('후기를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const uiReviews = useMemo(() => {
    if (!Array.isArray(reviews)) return [];
    return (reviews as JobReviewItem[]).map((r, idx) => {
      const status =
        r.final_result === 'final_pass'
          ? '최종합격'
          : r.final_result === 'second_pass'
            ? '2차합격'
            : r.final_result === 'first_pass'
              ? '1차합격'
              : '불합격';

      return {
        id: r.id ?? idx,
        company: r.company_name,
        status,
        content: r.interview_review,
        date: formatDateToKorean(r.interview_date),
      };
    });
  }, [reviews]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleWrite}
          className="rounded-[8px] bg-mainBlue px-8 py-2 text-h4 text-white hover:bg-blue-600"
        >
          작성하기
        </button>
      </div>

      {loading && <div className="py-10 text-center text-gray-500">불러오는 중...</div>}
      {error && !loading && <div className="py-10 text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {uiReviews.map((review) => (
            <ReviewCard
              key={review.id}
              reviewId={review.id}
              {...review}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {uiReviews.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500">
              작성한 후기가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
