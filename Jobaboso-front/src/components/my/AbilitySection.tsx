import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import TagInput from '@components/common/TagInput';

interface ProjectType {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface ActivityType {
  type: string;
  title: string;
  detail: string;
  activity_date: string;
}

interface CertificateType {
  name: string;
  issuer: string;
  date: string;
}

interface AbilitySectionProps {
  certificates: CertificateType[];
  activities: ActivityType[];
  contests: string[];
  projects: ProjectType[];
  onCertificatesChange: (certificates: CertificateType[]) => void;
  onActivitiesChange: (activities: ActivityType[]) => void;
  onContestsChange: (contests: string[]) => void;
  onProjectsChange: (projects: ProjectType[]) => void;
  formatDateInput: (value: string) => string;
}

const AbilitySection: React.FC<AbilitySectionProps> = ({
  certificates,
  activities,
  contests,
  projects,
  onCertificatesChange,
  onActivitiesChange,
  onContestsChange,
  onProjectsChange,
  formatDateInput,
}) => {
  // 추가 모드 상태 관리
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showClubForm, setShowClubForm] = useState(false);

  // 임시 입력값들을 저장할 state 추가
  const [tempCertificate, setTempCertificate] = useState({ name: '', issuer: '', date: '' });
  const [tempActivity, setTempActivity] = useState({
    type: '',
    title: '',
    detail: '',
    activity_date: '',
  });
  const [tempProject, setTempProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  const [tempClub, setTempClub] = useState({ title: '', detail: '', activity_date: '' });

  // 첫 번째 빈 필드에 포커스 이동하는 함수
  const focusFirstEmptyField = (formType: 'certificate' | 'activity' | 'project' | 'club') => {
    setTimeout(() => {
      if (formType === 'certificate') {
        document.getElementById('temp-cert-name')?.focus();
      } else if (formType === 'activity') {
        document.getElementById('temp-activity-type')?.focus();
      } else if (formType === 'project') {
        document.getElementById('temp-project-name')?.focus();
      } else if (formType === 'club') {
        document.getElementById('temp-club-name')?.focus();
      }
    }, 100);
  };

  const addCertificate = () => {
    // 모든 필수 필드가 채워졌는지 확인
    if (
      tempCertificate.name.trim() &&
      tempCertificate.issuer.trim() &&
      tempCertificate.date.trim()
    ) {
      const newCertificate = { ...tempCertificate };
      onCertificatesChange([...certificates, newCertificate]);
      setTempCertificate({ name: '', issuer: '', date: '' });
    } else {
      alert('모든 입력필드를 채워주세요.');
    }
  };

  const cancelCertificate = () => {
    setTempCertificate({ name: '', issuer: '', date: '' });
  };

  const removeCertificate = (index: number) => {
    onCertificatesChange(certificates.filter((_, i) => i !== index));
  };

  const handleCertificateChange =
    (index: number, field: keyof CertificateType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCertificates = [...certificates];
      newCertificates[index] = {
        ...newCertificates[index],
        [field]: e.target.value,
      };
      onCertificatesChange(newCertificates);
    };

  const addActivity = () => {
    // 모든 필수 필드가 채워졌는지 확인
    if (
      tempActivity.type.trim() &&
      tempActivity.title.trim() &&
      tempActivity.detail.trim() &&
      tempActivity.activity_date.trim()
    ) {
      const newActivity = { ...tempActivity };
      onActivitiesChange([...activities, newActivity]);
      setTempActivity({ type: '', title: '', detail: '', activity_date: '' });
    } else {
      alert('모든 입력필드를 채워주세요.');
    }
  };

  const cancelActivity = () => {
    setTempActivity({ type: '', title: '', detail: '', activity_date: '' });
  };

  const removeActivity = (index: number) => {
    onActivitiesChange(activities.filter((_, i) => i !== index));
  };

  const handleActivityChange =
    (index: number, field: keyof ActivityType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const newActivities = [...activities];
      newActivities[index] = {
        ...newActivities[index],
        [field]: e.target.value,
      };
      onActivitiesChange(newActivities);
    };

  const addProject = () => {
    // 모든 필수 필드가 채워졌는지 확인
    if (
      tempProject.name.trim() &&
      tempProject.description.trim() &&
      tempProject.start_date.trim() &&
      tempProject.end_date.trim()
    ) {
      const newProject = { ...tempProject };
      onProjectsChange([...projects, newProject]);
      setTempProject({ name: '', description: '', start_date: '', end_date: '' });
    } else {
      alert('모든 입력필드를 채워주세요.');
    }
  };

  const cancelProject = () => {
    setTempProject({ name: '', description: '', start_date: '', end_date: '' });
  };

  const removeProject = (index: number) => {
    onProjectsChange(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange =
    (index: number, field: keyof ProjectType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newProjects = [...projects];
      newProjects[index] = {
        ...newProjects[index],
        [field]: e.target.value,
      };
      onProjectsChange(newProjects);
    };

  const addClub = () => {
    // 모든 필수 필드가 채워졌는지 확인
    if (tempClub.title.trim() && tempClub.detail.trim() && tempClub.activity_date.trim()) {
      const newClub = { type: 'club', ...tempClub };
      onActivitiesChange([...activities, newClub]);
      setTempClub({ title: '', detail: '', activity_date: '' });
    } else {
      alert('모든 입력필드를 채워주세요.');
    }
  };

  const cancelClub = () => {
    setTempClub({ title: '', detail: '', activity_date: '' });
  };

  return (
    <div className="mb-16 w-[862px]">
      <h2 className="mb-10 text-h2 font-semibold text-gray-800">보유역량</h2>

      {/* 자격증 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center">
          <label htmlFor="cert-name" className="text-h4 font-medium text-gray-700">
            자격증
          </label>
          <button
            onClick={addCertificate}
            className="ml-auto rounded-full bg-subLightBlue px-2 py-1 text-sm font-medium text-mainBlue transition-colors hover:bg-blue-100"
          >
            추가하기
          </button>
        </div>
        {certificates.map((cert, index) => (
          <div key={index} className="mb-2 flex items-center gap-4">
            <input
              className="h-[66px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="자격증명을 검색해주세요."
              value={cert.name}
              onChange={handleCertificateChange(index, 'name')}
            />
            <input
              className="h-[66px] w-1/4 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="합격여부"
              value={cert.issuer}
              onChange={handleCertificateChange(index, 'issuer')}
            />
            <input
              className="h-[66px] w-1/4 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="YYYY-MM-DD"
              value={cert.date}
              onChange={(e) => {
                const newCertificates = [...certificates];
                newCertificates[index] = {
                  ...newCertificates[index],
                  date: formatDateInput(e.target.value),
                };
                onCertificatesChange(newCertificates);
              }}
            />
            <button
              onClick={() => removeCertificate(index)}
              className="p-2 text-red-500 transition-colors hover:text-red-700"
            >
              <FiX size={20} />
            </button>
          </div>
        ))}
        <div className="mb-2 flex items-center gap-4">
          <input
            id="temp-cert-name"
            className="h-[66px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
            placeholder="자격증명을 검색해주세요."
            value={tempCertificate.name}
            onChange={(e) => {
              const newName = e.target.value;
              setTempCertificate((prev) => ({
                ...prev,
                name: newName,
              }));
            }}
          />
          <input
            id="temp-cert-issuer"
            className="h-[66px] w-1/4 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
            placeholder="합격여부"
            value={tempCertificate.issuer}
            onChange={(e) => {
              const newIssuer = e.target.value;
              setTempCertificate((prev) => ({
                ...prev,
                issuer: newIssuer,
              }));
            }}
          />
          <input
            id="temp-cert-date"
            className="h-[66px] w-1/4 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
            placeholder="YYYY-MM-DD"
            value={tempCertificate.date}
            onChange={(e) => {
              const formattedValue = formatDateInput(e.target.value);
              setTempCertificate((prev) => ({
                ...prev,
                date: formattedValue,
              }));
            }}
          />
        </div>
      </div>

      {/* 인턴 및 대외활동 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center">
          <label htmlFor="activity-type" className="text-h4 font-medium text-gray-700">
            인턴 및 대외활동
          </label>
          <button
            onClick={addActivity}
            className="ml-auto rounded-full bg-subLightBlue px-2 py-1 text-sm font-medium text-mainBlue transition-colors hover:bg-blue-100"
          >
            추가하기
          </button>
        </div>
        {activities
          .filter((activity) => activity.type !== 'club')
          .map((activity, index) => (
            <div key={index} className="mb-4 rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex gap-4">
                <div className="w-1/2">
                  <select
                    className="h-[66px] w-full rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                    value={activity.type}
                    onChange={handleActivityChange(index, 'type')}
                  >
                    <option value="">활동구분을 선택하세요</option>
                    <option value="intern">인턴</option>
                    <option value="contest">대회</option>
                  </select>
                </div>
                <input
                  className="h-[66px] w-1/2 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                  placeholder="활동명/제목"
                  value={activity.title}
                  onChange={handleActivityChange(index, 'title')}
                />
              </div>
              <div className="mb-2 flex gap-4">
                <input
                  className="h-[66px] w-full rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                  placeholder="YYYY-MM-DD"
                  value={activity.activity_date}
                  onChange={(e) => {
                    const newActivities = [...activities];
                    newActivities[index] = {
                      ...newActivities[index],
                      activity_date: formatDateInput(e.target.value),
                    };
                    onActivitiesChange(newActivities);
                  }}
                />
              </div>
              <div className="flex gap-2">
                <textarea
                  className="min-h-[80px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-6 py-4 text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                  placeholder="활동 상세 내용을 입력하세요"
                  value={activity.detail}
                  onChange={handleActivityChange(index, 'detail')}
                />
                <button
                  onClick={() => removeActivity(index)}
                  className="self-start p-2 text-red-500 transition-colors hover:text-red-700"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          ))}
        <div className="mb-4 rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex gap-4">
            <div className="w-1/2">
              <select
                id="temp-activity-type"
                className="h-[66px] w-full rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                value={tempActivity.type}
                onChange={(e) => setTempActivity((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="">활동구분을 선택하세요</option>
                <option value="intern">인턴</option>
                <option value="contest">대회</option>
              </select>
            </div>
            <input
              id="temp-activity-title"
              className="h-[66px] w-1/2 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="활동명/제목"
              value={tempActivity.title}
              onChange={(e) => setTempActivity((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="mb-2 flex gap-4">
            <input
              id="temp-activity-date"
              className="h-[66px] w-full rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="YYYY-MM-DD"
              value={tempActivity.activity_date}
              onChange={(e) => {
                const formattedValue = formatDateInput(e.target.value);
                setTempActivity((prev) => ({ ...prev, activity_date: formattedValue }));
              }}
            />
          </div>
          <div className="flex gap-2">
            <textarea
              id="temp-activity-detail"
              className="min-h-[80px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-6 py-4 text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="활동 상세 내용을 입력하세요"
              value={tempActivity.detail}
              onChange={(e) => setTempActivity((prev) => ({ ...prev, detail: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* 프로젝트 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center">
          <label htmlFor="project-name" className="text-h4 font-medium text-gray-700">
            프로젝트
          </label>
          <button
            onClick={addProject}
            className="ml-auto rounded-full bg-subLightBlue px-2 py-1 text-sm font-medium text-mainBlue transition-colors hover:bg-blue-100"
          >
            추가하기
          </button>
        </div>
        {projects.map((project, index) => (
          <div key={index} className="mb-4 rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex gap-4">
              <input
                className="h-[66px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                placeholder="프로젝트명"
                value={project.name}
                onChange={handleProjectChange(index, 'name')}
              />
              <input
                className="h-[66px] w-1/3 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                placeholder="시작일 (YYYY-MM-DD)"
                value={project.start_date}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index] = {
                    ...newProjects[index],
                    start_date: formatDateInput(e.target.value),
                  };
                  onProjectsChange(newProjects);
                }}
              />
              <input
                className="h-[66px] w-1/3 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                placeholder="종료일 (YYYY-MM-DD)"
                value={project.end_date}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index] = {
                    ...newProjects[index],
                    end_date: formatDateInput(e.target.value),
                  };
                  onProjectsChange(newProjects);
                }}
              />
            </div>
            <div className="flex gap-2">
              <textarea
                className="min-h-[80px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-6 py-4 text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                placeholder="프로젝트 설명을 입력하세요"
                value={project.description}
                onChange={handleProjectChange(index, 'description')}
              />
              <button
                onClick={() => removeProject(index)}
                className="self-start p-2 text-red-500 transition-colors hover:text-red-700"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        ))}
        <div className="mb-4 rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex gap-4">
            <input
              id="temp-project-name"
              className="h-[66px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="프로젝트명"
              value={tempProject.name}
              onChange={(e) => setTempProject((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              id="temp-project-start"
              className="h-[66px] w-1/3 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="시작일 (YYYY-MM-DD)"
              value={tempProject.start_date}
              onChange={(e) => {
                const formattedValue = formatDateInput(e.target.value);
                setTempProject((prev) => ({ ...prev, start_date: formattedValue }));
              }}
            />
            <input
              id="temp-project-end"
              className="h-[66px] w-1/3 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="종료일 (YYYY-MM-DD)"
              value={tempProject.end_date}
              onChange={(e) => {
                const formattedValue = formatDateInput(e.target.value);
                setTempProject((prev) => ({ ...prev, end_date: formattedValue }));
              }}
            />
          </div>
          <div className="flex gap-2">
            <textarea
              id="temp-project-desc"
              className="min-h-[80px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-6 py-4 text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="프로젝트 설명을 입력하세요"
              value={tempProject.description}
              onChange={(e) => setTempProject((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* 동아리 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center">
          <label htmlFor="club-name" className="text-h4 font-medium text-gray-700">
            동아리
          </label>
          <button
            onClick={addClub}
            className="ml-auto rounded-full bg-subLightBlue px-2 py-1 text-sm font-medium text-mainBlue transition-colors hover:bg-blue-100"
          >
            추가하기
          </button>
        </div>
        {/* 기존 동아리 목록 */}
        {activities
          .filter((activity) => activity.type === 'club')
          .map((club, index) => {
            const clubIndex = activities.findIndex((a) => a === club);
            return (
              <div key={clubIndex} className="mb-4 rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex gap-4">
                  <input
                    className="h-[66px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                    placeholder="동아리명"
                    value={club.title}
                    onChange={(e) => {
                      const newActivities = [...activities];
                      newActivities[clubIndex] = {
                        ...newActivities[clubIndex],
                        title: e.target.value,
                      };
                      onActivitiesChange(newActivities);
                    }}
                  />
                  <input
                    className="h-[66px] w-1/2 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                    placeholder="시작일 (YYYY-MM-DD)"
                    value={club.activity_date}
                    onChange={(e) => {
                      const newActivities = [...activities];
                      newActivities[clubIndex] = {
                        ...newActivities[clubIndex],
                        activity_date: formatDateInput(e.target.value),
                      };
                      onActivitiesChange(newActivities);
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <textarea
                    className="min-h-[80px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-6 py-4 text-h4 text-gray-600 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
                    placeholder="동아리 활동 내용을 입력하세요"
                    value={club.detail}
                    onChange={(e) => {
                      const newActivities = [...activities];
                      newActivities[clubIndex] = {
                        ...newActivities[clubIndex],
                        detail: e.target.value,
                      };
                      onActivitiesChange(newActivities);
                    }}
                  />
                  <button
                    onClick={() => {
                      onActivitiesChange(activities.filter((_, i) => i !== clubIndex));
                    }}
                    className="self-start p-2 text-red-500 transition-colors hover:text-red-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        <div className="mb-4 rounded-lg border border-gray-200 p-4">
          <div className="mb-2 flex gap-4">
            <input
              id="temp-club-name"
              className="h-[66px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="동아리명"
              value={tempClub.title}
              onChange={(e) => setTempClub((prev) => ({ ...prev, title: e.target.value }))}
            />
            <input
              id="temp-club-start"
              className="h-[66px] w-1/2 rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="시작일 (YYYY-MM-DD)"
              value={tempClub.activity_date}
              onChange={(e) => {
                const formattedValue = formatDateInput(e.target.value);
                setTempClub((prev) => ({ ...prev, activity_date: formattedValue }));
              }}
            />
          </div>
          <div className="flex gap-2">
            <textarea
              id="temp-club-desc"
              className="min-h-[80px] flex-1 resize-none rounded-xl border border-gray-200 bg-white px-6 py-4 text-h4 text-gray-600 placeholder-gray-400 transition-all duration-200 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              placeholder="동아리 활동 내용을 입력하세요"
              value={tempClub.detail}
              onChange={(e) => setTempClub((prev) => ({ ...prev, detail: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbilitySection;
