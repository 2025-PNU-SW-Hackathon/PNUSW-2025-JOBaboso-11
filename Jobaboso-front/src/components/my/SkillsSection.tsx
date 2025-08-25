import React from 'react';

interface SkillsSectionProps {
  skills: (string | { skill_name: string })[];
  userName: string;
  onSkillRemove: (skillToRemove: string) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, userName, onSkillRemove }) => {
  return (
    <div className="mb-16 w-[862px]">
      <h2 className="mb-10 text-h2 font-semibold text-gray-800">스킬</h2>
      <div className="rounded-xl border border-gray-200 p-6">
        <div className="mb-2 flex items-center gap-2 text-h4 font-semibold text-gray-700">
          나의 스킬 <span className="text-sm">({skills.length}/20)</span>
        </div>
        <div className="mb-2 text-bodyLg text-gray-500">
          {userName} 님이 선택하신 스킬을 기반으로 추천해드려요!
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => {
            const skillText =
              typeof skill === 'string'
                ? skill
                : skill && typeof skill === 'object' && skill.skill_name
                  ? skill.skill_name
                  : '';

            if (!skillText) return null;

            return (
              <span
                key={skillText || index}
                className="flex items-center gap-1 rounded-xl border border-mainBlue bg-subLightBlue px-4 py-2 text-h4 font-medium text-mainBlue shadow-none"
              >
                {skillText}
                <button
                  type="button"
                  className="ml-1 text-lg text-mainBlue hover:text-blue-800"
                  onClick={() => onSkillRemove(skillText)}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
