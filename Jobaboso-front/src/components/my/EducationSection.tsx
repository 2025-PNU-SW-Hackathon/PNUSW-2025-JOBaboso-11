import React from 'react';

interface EducationSectionProps {
  schoolName: string;
  major: string;
  admissionYear: string;
  status: string;
  score: string;
  graduationYear: string;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  schoolName,
  major,
  admissionYear,
  status,
  score,
  graduationYear,
}) => {
  return (
    <div className="mt-10 rounded-xl border border-gray-200 p-8">
      <div className="mt-3 flex items-center self-start">
        <img src="/ic_education.svg" alt="학력" className="z-10 mr-2 w-[35px] object-contain" />
        <p className="text-h1 font-medium text-gray-800">학력</p>
      </div>
      <div className="mx-10 my-2 grid grid-cols-2 gap-6">
        {/* 열 1 */}
        <div>
          {/* 학교명 */}
          <div className="mt-8 flex items-center self-start">
            <div className="rounded-full border border-gray-400 bg-gray-100 px-3 py-1">학교명</div>
            <div className="ml-3 text-bodyLg text-gray-800">{schoolName}</div>
          </div>
          {/* 주전공 */}
          <div className="mt-8 flex items-center self-start">
            <div className="rounded-full border border-gray-400 bg-gray-100 px-3 py-1">주전공</div>
            <div className="ml-3 text-bodyLg text-gray-800">{major}</div>
          </div>
          {/* 입학년도 */}
          <div className="mt-8 flex items-center self-start">
            <div className="rounded-full border border-gray-400 bg-gray-100 px-3 py-1">
              입학년도
            </div>
            <div className="ml-3 text-bodyLg text-gray-800">{admissionYear}</div>
          </div>
        </div>
        {/* 열 2 */}
        <div>
          {/* 상태 */}
          <div className="mt-8 flex items-center self-start">
            <div className="rounded-full border border-gray-400 bg-gray-100 px-3 py-1">상태</div>
            <div className="ml-3 text-bodyLg text-gray-800">{status}</div>
          </div>
          {/* 학점 */}
          <div className="mt-8 flex items-center self-start">
            <div className="rounded-full border border-gray-400 bg-gray-100 px-3 py-1">학점</div>
            <div className="ml-3 text-bodyLg text-gray-800">{score}</div>
          </div>
          {/* 졸업년도 */}
          <div className="mt-8 flex items-center self-start">
            <div className="rounded-full border border-gray-400 bg-gray-100 px-3 py-1">
              졸업년도
            </div>
            <div className="ml-3 text-bodyLg text-gray-800">{graduationYear}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
