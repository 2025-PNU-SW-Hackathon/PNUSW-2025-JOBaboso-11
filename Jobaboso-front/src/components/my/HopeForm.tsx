import React from 'react';
import TagInput from '@components/common/TagInput';

interface HopeFormProps {
  companies: string[];
  jobs: string[];
  regions: string[];
  onCompaniesChange: (companies: string[]) => void;
  onJobsChange: (jobs: string[]) => void;
  onRegionsChange: (regions: string[]) => void;
}

const HopeForm: React.FC<HopeFormProps> = ({
  companies,
  jobs,
  regions,
  onCompaniesChange,
  onJobsChange,
  onRegionsChange,
}) => {
  return (
    <div className="mb-16">
      <h2 className="mb-10 text-h2 font-semibold text-gray-800">희망 근무 조건</h2>
      <div className="grid grid-cols-[865px] gap-6">
        <TagInput
          id="companies"
          label="희망기업"
          placeholder="희망기업을 입력하세요"
          value={companies}
          onChange={onCompaniesChange}
        />
        <TagInput
          id="jobs"
          label="희망직군"
          placeholder="희망직군을 입력하세요"
          value={jobs}
          onChange={onJobsChange}
        />
        <TagInput
          id="regions"
          label="근무지역"
          placeholder="근무지역을 입력하세요"
          value={regions}
          onChange={onRegionsChange}
        />
      </div>
    </div>
  );
};

export default HopeForm;
