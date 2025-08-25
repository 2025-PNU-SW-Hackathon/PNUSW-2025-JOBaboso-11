import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiSearch } from 'react-icons/fi';
import ResumeSidebar from '@components/my/SpecSidebar';
import WelcomeBanner from '@components/my/WelcomeBanner';
import PersonalInfoForm from '@components/my/PersonalInfoForm';
import EducationForm from '@components/my/EducationForm';
import HopeForm from '@components/my/HopeForm';
import AbilitySection from '@components/my/AbilitySection';
import SkillSearchSection from '@components/my/SkillSearchSection';
import {
  formatDateInput,
  formatYearMonthInput,
  formatYearMonthKoreanInput,
  parseDate,
  parseYearMonthKorean,
  formatDateToKorean,
} from '@utils/dateUtils';
import { formatPhoneNumber } from '@utils/phoneUtils';
import api from '@apis/api';

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

interface FormType {
  name: string;
  phone: string;
  gender: string;
  birth: string;
  email: string;
  university: string;
  major: string;
  gpa: string;
  startDate: string;
  endDate: string;
  status: string;
  agree: boolean;
  companies: string[];
  jobs: string[];
  regions: string[];
  projects: ProjectType[];
  activities: ActivityType[];
  certificates: CertificateType[];
  contests: string[];
  bootcamps: string[];
  research: string[];
  skills: string[];
}

const SpecEditPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormType>({
    name: '',
    phone: '',
    gender: '여성',
    birth: '',
    email: '',
    university: '',
    major: '',
    gpa: '',
    startDate: '2021년 3월',
    endDate: '2026년 2월',
    status: '재학중',
    agree: true,
    companies: [],
    jobs: [],
    regions: [],
    projects: [],
    activities: [],
    certificates: [],
    contests: [],
    bootcamps: [],
    research: [],
    skills: [],
  });

  const [loading, setLoading] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 추천 스킬 목록
  const recommendedSkills = [
    'Figma',
    'Adobe XD',
    'Sketch',
    'InVision',
    'Zeplin',
    'Principle',
    'Photoshop',
    'Illustrator',
    'After Effects',
    'Premiere Pro',
    'HTML/CSS',
    'JavaScript',
    'React',
    'Vue.js',
    'Angular',
    'User Research',
    'Usability Testing',
    'Wireframing',
    'Prototyping',
  ];

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;

        const response = await api.get('/spec/all');
        const data = response.data;

        if (data) {
          setForm((prev) => ({
            ...prev,
            name: data.personal_info?.name || '',
            phone: data.personal_info?.phone || '',
            gender: data.personal_info?.gender === 'M' ? '남성' : '여성',
            birth: data.personal_info?.birth_date || '',
            email: data.personal_info?.email || '',
            university: data.education?.school_name || '',
            major: data.education?.major || '',
            gpa: data.education?.score?.toString() || '',
            startDate: data.education?.admission_year
              ? formatDateToKorean(data.education.admission_year)
              : '2021년 3월',
            endDate: data.education?.graduation_year
              ? formatDateToKorean(data.education.graduation_year)
              : '2026년 2월',
            status: data.education?.status || '재학중',
            companies: data.hope?.company ? data.hope.company.split(', ') : [],
            jobs: data.hope?.job ? data.hope.job.split(', ') : [],
            regions: data.hope?.region ? data.hope.region.split(', ') : [],
            projects:
              data.projects?.map((p: any) => ({
                name: p.project_name || p.name || '',
                description: p.description || '',
                start_date: p.start_date || '',
                end_date: p.end_date || '',
              })) || [],
            activities: data.activities || [],
            certificates:
              data.certificates?.map((c: any) => ({
                name: c.cert_name || c.name || '',
                issuer: c.score || c.issuer || '',
                date: c.certificate_date || c.date || '',
              })) || [],
            skills:
              data.skills
                ?.map((s: any) => (typeof s === 'string' ? s : s.skill_name || ''))
                .filter(Boolean) || [],
          }));
        }
      } catch (error) {
        console.error('이력서 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field.includes('Date')
      ? formatYearMonthInput(e.target.value)
      : formatDateInput(e.target.value);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }));
  };

  const handleSectionClick = (label: string) => {
    const ref = sectionRefs.current[label];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    const body = {
      skills: form.skills.map((skill) => ({ skill_name: skill })),
      projects: form.projects.map((project) => ({
        project_name: project.name,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
      })),
      activities: form.activities,
      certificates: form.certificates.map((cert) => ({
        cert_name: cert.name,
        score: cert.issuer,
        certificate_date: cert.date,
      })),
      contests: form.contests,
      bootcamps: form.bootcamps,
      research: form.research,
      education: {
        school_name: form.university,
        major: form.major,
        admission_year: parseYearMonthKorean(form.startDate),
        graduation_year: parseYearMonthKorean(form.endDate),
        status: form.status,
        score: parseFloat(form.gpa),
      },
      hope: {
        company: form.companies.join(', '),
        job: form.jobs.join(', '),
        region: form.regions.join(', '),
      },
    };

    try {
      await api.post('/spec/all', body);
      alert('스펙이 성공적으로 저장되었습니다.');
      navigate('/my/spec');
    } catch (e) {
      alert('에러 발생: ' + e);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (form.skills.includes(skill)) {
      setForm((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skill),
      }));
    } else if (form.skills.length < 20) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addCertificate = () => {
    setForm((prev) => ({
      ...prev,
      certificates: [...prev.certificates, { name: '', issuer: '', date: '' }],
    }));
  };

  const removeCertificate = (index: number) => {
    setForm((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  const handleCertificateChange =
    (index: number, field: keyof CertificateType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCertificates = [...form.certificates];
      newCertificates[index] = {
        ...newCertificates[index],
        [field]: e.target.value,
      };
      setForm({ ...form, certificates: newCertificates });
    };

  const addActivity = () => {
    setForm((prev) => ({
      ...prev,
      activities: [...prev.activities, { type: '', title: '', detail: '', activity_date: '' }],
    }));
  };

  const removeActivity = (index: number) => {
    setForm((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  const handleActivityChange =
    (index: number, field: keyof ActivityType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const newActivities = [...form.activities];
      newActivities[index] = {
        ...newActivities[index],
        [field]: e.target.value,
      };
      setForm({ ...form, activities: newActivities });
    };

  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', start_date: '', end_date: '' }],
    }));
  };

  const removeProject = (index: number) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleProjectChange =
    (index: number, field: keyof ProjectType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newProjects = [...form.projects];
      newProjects[index] = {
        ...newProjects[index],
        [field]: e.target.value,
      };
      setForm({ ...form, projects: newProjects });
    };

  const addClub = () => {
    setForm((prev) => ({
      ...prev,
      activities: [...prev.activities, { type: 'club', title: '', detail: '', activity_date: '' }],
    }));
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="mx-auto mr-10 w-[1096px]">
        <WelcomeBanner name={form.name} />

        <div
          ref={(el) => {
            sectionRefs.current['인적사항'] = el;
          }}
          id="section-personal"
        >
          <PersonalInfoForm form={form} onChange={handleChange} onPhoneChange={handlePhoneChange} />
        </div>

        <div
          ref={(el) => {
            sectionRefs.current['학력'] = el;
          }}
          id="section-education"
        >
          <EducationForm
            form={form}
            onChange={handleChange}
            onDateChange={handleDateChange}
            onStartDateChange={(e) => {
              const formattedValue = formatYearMonthKoreanInput(e.target.value);
              setForm((prev) => ({ ...prev, startDate: formattedValue }));
            }}
            onEndDateChange={(e) => {
              const formattedValue = formatYearMonthKoreanInput(e.target.value);
              setForm((prev) => ({ ...prev, endDate: formattedValue }));
            }}
          />
        </div>

        <div
          ref={(el) => {
            sectionRefs.current['희망근무조건'] = el;
          }}
          id="section-hope"
        >
          <HopeForm
            companies={form.companies}
            jobs={form.jobs}
            regions={form.regions}
            onCompaniesChange={(companies) => setForm((prev) => ({ ...prev, companies }))}
            onJobsChange={(jobs) => setForm((prev) => ({ ...prev, jobs }))}
            onRegionsChange={(regions) => setForm((prev) => ({ ...prev, regions }))}
          />
        </div>

        <div
          ref={(el) => {
            sectionRefs.current['보유역량'] = el;
          }}
          id="section-ability"
        >
          <AbilitySection
            certificates={form.certificates}
            activities={form.activities}
            contests={form.contests}
            projects={form.projects}
            onCertificatesChange={(certificates) => setForm((prev) => ({ ...prev, certificates }))}
            onActivitiesChange={(activities) => setForm((prev) => ({ ...prev, activities }))}
            onContestsChange={(contests) => setForm((prev) => ({ ...prev, contests }))}
            onProjectsChange={(projects) => setForm((prev) => ({ ...prev, projects }))}
            formatDateInput={formatDateInput}
          />
        </div>

        <div
          ref={(el) => {
            sectionRefs.current['스킬'] = el;
          }}
          id="section-skill"
        >
          <h2 className="mb-10 text-h2 font-semibold text-gray-800">스킬</h2>
          <div className="grid grid-cols-[865px] gap-6">
            <SkillSearchSection
              recommendedSkills={recommendedSkills}
              selectedSkills={form.skills}
              onSkillToggle={handleSkillToggle}
            />
            <div className="rounded-xl border border-gray-200 p-6">
              <div className="mb-2 flex items-center gap-2 text-h4 font-semibold text-gray-700">
                나의 스킬 <span className="text-sm">({form.skills.length}/20)</span>
              </div>
              <div className="mb-2 text-bodyLg text-gray-500">
                {form.name} 님이 선택하신 스킬을 기반으로 추천해드려요!
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-xl border border-mainBlue bg-subLightBlue px-4 py-2 text-h4 font-medium text-mainBlue shadow-none"
                  >
                    {skill}
                    <button
                      type="button"
                      className="ml-1 text-lg text-mainBlue hover:text-blue-800"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mr-32">
        <div className="fixed right-32 top-60 z-30 w-[240px]">
          <ResumeSidebar
            onSectionClick={handleSectionClick}
            onSave={handleSave}
            isAgreed={form.agree}
          />
        </div>
      </div>
    </div>
  );
};

export default SpecEditPage;
