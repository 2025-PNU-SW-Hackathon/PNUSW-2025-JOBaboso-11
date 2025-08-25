import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SkillSearchSectionProps {
  recommendedSkills: string[];
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
}

const SkillSearchSection: React.FC<SkillSearchSectionProps> = ({
  recommendedSkills,
  selectedSkills,
  onSkillToggle,
}) => {
  return (
    <>
      <label htmlFor="skill-search" className="sr-only">
        스킬 검색
      </label>
      <div className="relative mb-6">
        <input
          id="skill-search"
          className="h-[56px] w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4 text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
          placeholder="찾으시는 스킬을 검색해보세요."
          disabled
        />
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full border border-mainBlue px-4 py-2 text-h4 font-semibold text-gray-700">
          UI·UX 디자이너
        </span>
        <span className="cursor-pointer text-xs text-gray-400">전체보기</span>
      </div>
      <div className="mb-2 text-bodyLg text-gray-500">
        선택하신 직무에 맞는 스킬을 추천해드려요!
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {recommendedSkills.map((skill) => (
          <button
            key={skill}
            type="button"
            className={
              selectedSkills.includes(skill)
                ? 'flex items-center gap-1 rounded-xl border border-mainBlue bg-subLightBlue px-4 py-2 text-h4 font-medium text-mainBlue shadow-none'
                : 'flex items-center gap-1 rounded-xl border border-gray-100 px-4 py-2 text-h4 font-medium text-gray-600 shadow-none'
            }
            style={{ minWidth: 'fit-content' }}
            onClick={() => onSkillToggle(skill)}
          >
            {selectedSkills.includes(skill) ? (
              <span className="mr-1 text-lg">✓</span>
            ) : (
              <span className="mr-1 text-lg">+</span>
            )}
            {skill}
          </button>
        ))}
      </div>
    </>
  );
};

export default SkillSearchSection;
