import React from 'react';
import { Link } from 'react-router-dom';
import { Result, ResultLabelMap, ResultStyleMap } from '../../type/Result';

interface SimilarSpecResult {
  id: number;
  company: string;
  position: string;
  result: Result;
  internships: string;
  certificates: string;
  university: string;
  major: string;
  gpa: string;
  gpaScale: string;
  acceptanceRate: string;
  pointCost: number;
}

const SimilarSpecResults: React.FC = () => {
  // 비슷한 스펙을 가진 사람들의 합불 결과 목데이터
  const results: SimilarSpecResult[] = [
    {
      id: 1,
      company: '토스',
      position: '프론트엔드',
      result: 'final_accepted' as Result,
      internships: '인턴 및 대외활동 8회',
      certificates: '자격증 2개',
      university: '부산대',
      major: '컴퓨터공학과',
      gpa: '4.2',
      gpaScale: '4.5',
      acceptanceRate: '98%',
      pointCost: 10,
    },
    {
      id: 2,
      company: '네이버',
      position: '프론트엔드',
      result: 'final_accepted' as Result,
      internships: '인턴 및 대외활동 1회',
      certificates: '자격증 4개',
      university: '부산대',
      major: '컴퓨터공학과',
      gpa: '4.0',
      gpaScale: '4.5',
      acceptanceRate: '95%',
      pointCost: 10,
    },
    {
      id: 3,
      company: '카카오',
      position: '프론트엔드',
      result: 'final_accepted' as Result,
      internships: '인턴 및 대외활동 8회',
      certificates: '자격증 2개',
      university: '부산대',
      major: '컴퓨터공학과',
      gpa: '4.1',
      gpaScale: '4.5',
      acceptanceRate: '92%',
      pointCost: 10,
    },
    {
      id: 4,
      company: '쿠팡',
      position: '백엔드',
      result: 'final_accepted' as Result,
      internships: '인턴 및 대외활동 8회',
      certificates: '자격증 2개',
      university: '부산대',
      major: '컴퓨터공학과',
      gpa: '4.3',
      gpaScale: '4.5',
      acceptanceRate: '89%',
      pointCost: 10,
    },
  ];

  // 사용자 이름을 localStorage에서 가져오기
  const userName = localStorage.getItem('name') || '사용자';

  return (
    <div className="mb-20 mt-20 w-full">
      <div className="mx-auto w-[1528px]">
        <div className="flex items-center justify-between">
          <div className="text-h2 font-semibold text-gray-700">
            비슷한 스펙을 가진 사람들의 합불 결과
          </div>
          <Link
            to="/benchmark"
            className="text-bodyMd text-mainBlue transition-colors hover:text-blue-700"
          >
            자세히 보기 &gt;
          </Link>
        </div>
        <div className="mt-2 text-bodyMd text-gray-700">
          {userName} 님과 비슷한 스펙을 가진 사람들의 합불 결과예요.
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-4 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                {/* 헤더: 회사명·직무와 합불 결과 */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-lg font-semibold text-gray-600">{result.company}</div>
                    <div className="mx-1 text-gray-600">·</div>
                    <div className="text-base font-normal text-gray-600">{result.position}</div>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-bodySm font-medium ${ResultStyleMap[result.result]}`}
                  >
                    {ResultLabelMap[result.result]}
                  </span>
                </div>

                {/* 스펙 태그들 */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-gray-200 px-2 py-1 text-sm text-gray-700">
                      {result.internships}
                    </div>
                    <div className="rounded-lg bg-gray-200 px-2 py-1 text-sm text-gray-700">
                      {result.certificates}
                    </div>
                  </div>

                  {/* 학교 정보 */}
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <img
                      src="/benchmark/ic_school.svg"
                      className="h-6 w-6 rounded-full bg-subLightBlue p-1"
                      alt="학교 아이콘"
                    />
                    <span>
                      {result.university} {result.major}
                    </span>
                  </div>

                  {/* 학점 정보 */}
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <img
                      src="/benchmark/ic_book.svg"
                      className="h-6 w-6 rounded-full bg-subLightBlue p-1"
                      alt="책 아이콘"
                    />
                    <span>
                      {result.gpa}/{result.gpaScale}
                    </span>
                  </div>

                  {/* 합격률 정보 */}
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <img
                      src="/benchmark/ic_paperplane.svg"
                      className="h-6 w-6 rounded-full bg-subLightBlue p-1"
                      alt="종이비행기 아이콘"
                    />
                    <span>합격률 {result.acceptanceRate}</span>
                  </div>
                </div>

                {/* 포인트로 열람하기 버튼 */}
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-subLightBlue px-4 py-3 text-lg font-semibold text-mainBlue transition-colors hover:bg-blue-600 hover:text-white">
                  <img src="/benchmark/ic_lock.svg" className="h-5 w-5" alt="자물쇠 아이콘" />
                  <span>{result.pointCost}포인트로 열람하기</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarSpecResults;
