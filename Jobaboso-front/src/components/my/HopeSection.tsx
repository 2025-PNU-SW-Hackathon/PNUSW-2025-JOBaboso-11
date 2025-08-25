import React from 'react';

interface HopeSectionProps {
  companies: string[];
  jobs: string[];
  regions: string[];
}

const HopeSection: React.FC<HopeSectionProps> = ({ companies, jobs, regions }) => {
  const renderTags = (items: string[], label: string) => (
    <div>
      <p className="mt-8 inline-block text-h3 text-gray-800">{label}</p>
      <div className="mt-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="mr-2 inline-block rounded-md border border-gray-100 bg-gray-100 px-3 py-1"
            >
              {item.trim()}
            </div>
          ))
        ) : (
          <div className="text-bodyLg text-gray-500">{label} 정보가 없습니다</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-10 w-[1048px] rounded-xl border border-gray-200 p-8">
      <div className="mt-3 flex items-center self-start">
        <img
          src="/ic_hope.svg"
          alt="희망 근무 조건"
          className="z-10 mr-2 w-[35px] object-contain"
        />
        <p className="text-h1 font-medium text-gray-800">희망 근무 조건</p>
      </div>
      <div className="mx-10 my-2">
        {renderTags(companies, '희망기업')}
        {renderTags(jobs, '희망직군')}
        {renderTags(regions, '근무지역')}
      </div>
    </div>
  );
};

export default HopeSection;
