import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getPersonalSpec,
  getPublicSpec,
  PersonalSpecResponse,
  PublicSpecResponse,
} from '@apis/auth';
import ProfileCard from '@components/my/ProfileCard';
import EducationSection from '@components/my/EducationSection';
import HopeSection from '@components/my/HopeSection';
import { formatDateToKorean, calculateAge, formatBirthDate } from '@utils/dateUtils';
import { formatPhoneNumber } from '@utils/phoneUtils';

const SpecPage = () => {
  const { id } = useParams();
  const [specData, setSpecData] = useState<PersonalSpecResponse | PublicSpecResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublicSpec, setIsPublicSpec] = useState(false);

  useEffect(() => {
    const fetchSpecData = async () => {
      try {
        setLoading(true);
        let data;

        if (id) {
          // 다른 사용자의 공개 스펙 조회
          data = await getPublicSpec(id);
          setIsPublicSpec(true);
        } else {
          // 본인의 스펙 조회
          data = await getPersonalSpec();
          setIsPublicSpec(false);
        }

        setSpecData(data);
      } catch (err) {
        console.error('스펙 데이터 조회 실패:', err);
        setError('스펙 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!specData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-gray-600">데이터가 없습니다.</div>
      </div>
    );
  }

  // 데이터 가공
  const companies = specData.hope.company ? specData.hope.company.split(', ') : [];
  const jobs = specData.hope.job ? specData.hope.job.split(', ') : [];
  const regions = specData.hope.region ? specData.hope.region.split(', ') : [];

  return (
    <div className="flex w-full justify-center">
      <div className="w-[1096px]">
        <p className="mt-6 text-h4 font-normal">
          {isPublicSpec ? '지원자 스펙' : '채용기업이 열람하는 나의 이력서입니다.'}
        </p>

        {/* 개인 스펙일 때만 프로필과 학력 표시 */}
        {!isPublicSpec && (
          <div className="grid grid-cols-[295px_720px] gap-8">
            {/* 프로필 */}
            {'personal_info' in specData && (
              <ProfileCard
                name={specData.personal_info.name}
                gender={specData.personal_info.gender}
                birthDate={formatBirthDate(specData.personal_info.birth_date)}
                age={calculateAge(specData.personal_info.birth_date)}
                phone={formatPhoneNumber(specData.personal_info.phone)}
                email={specData.personal_info.email}
              />
            )}

            {/* 학력 */}
            <EducationSection
              schoolName={specData.education.school_name}
              major={specData.education.major}
              admissionYear={formatDateToKorean(specData.education.admission_year)}
              status={specData.education.status}
              score={specData.education.score.toString()}
              graduationYear={formatDateToKorean(specData.education.graduation_year)}
            />
          </div>
        )}

        {/* 희망근무조건 */}
        <HopeSection companies={companies} jobs={jobs} regions={regions} />

        {/* 보유역량 1/2 */}
        <div className="mt-10 w-[1048px] rounded-xl border border-gray-200 p-8">
          {/* 보유역량 타이틀 */}
          <div className="mb-6 flex items-center">
            <img
              src="/ic_skill_1.svg"
              alt="보유역량 1"
              className="z-10 mr-2 w-[35px] object-contain"
            />
            <p className="text-h1 font-medium text-gray-800">보유역량</p>
          </div>

          <div className="mx-10 my-2">
            {/* 자격증 */}
            <div>
              <p className="mb-4 text-h3 font-medium text-gray-800">자격증</p>
              {specData.certificates.length > 0 ? (
                specData.certificates.map((cert, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 gap-4 bg-gray-50 px-6 py-4 ${
                      index === 0
                        ? 'border-x-0 border-y-[1.5px] border-gray-300'
                        : 'border-x-0 border-b-[1.5px] border-t-0 border-gray-300'
                    }`}
                  >
                    <div className="text-bodyLg text-gray-700">
                      {cert.certificate_date || cert.date || ''}
                    </div>
                    <div className="text-bodyLg text-gray-700">
                      {cert.cert_name || cert.name || ''}
                    </div>
                    <div className="text-bodyLg text-gray-700">
                      {cert.score || cert.issuer || ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-3 gap-4 border-x-0 border-y-[1.5px] border-gray-300 bg-gray-50 px-6 py-4">
                  <div className="text-bodyLg text-gray-700">자격증 정보가 없습니다</div>
                  <div className="text-bodyLg text-gray-700"></div>
                  <div className="text-bodyLg text-gray-700"></div>
                </div>
              )}
            </div>

            {/* 인턴 및 대외활동 */}
            <div>
              <p className="mb-4 mt-10 text-h3 font-medium text-gray-800">인턴 및 대외활동</p>
              {specData.activities.length > 0 ? (
                specData.activities.map((activity, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 gap-4 bg-gray-50 px-6 py-4 ${
                      index === 0
                        ? 'border-x-0 border-y-[1.5px] border-gray-300'
                        : 'border-x-0 border-b-[1.5px] border-t-0 border-gray-300'
                    }`}
                  >
                    <div className="text-bodyLg text-gray-700">{activity.activity_date || ''}</div>
                    <div className="text-bodyLg text-gray-700">{activity.title || ''}</div>
                    <div className="text-bodyLg text-gray-700">
                      {activity.type === 'intern'
                        ? '인턴'
                        : activity.type === 'club'
                          ? '동아리'
                          : activity.type === 'contest'
                            ? '대회'
                            : activity.type || ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-3 gap-4 border-x-0 border-y-[1.5px] border-gray-300 bg-gray-50 px-6 py-4">
                  <div className="text-bodyLg text-gray-700">인턴/대외활동 정보가 없습니다</div>
                  <div className="text-bodyLg text-gray-700"></div>
                  <div className="text-bodyLg text-gray-700"></div>
                </div>
              )}
            </div>

            {/* 프로젝트 */}
            <div>
              <p className="mb-4 mt-10 text-h3 font-medium text-gray-800">프로젝트</p>
              {specData.projects && specData.projects.length > 0 ? (
                specData.projects.map((project, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 gap-4 bg-gray-50 px-6 py-4 ${
                      index === 0
                        ? 'border-x-0 border-y-[1.5px] border-gray-300'
                        : 'border-x-0 border-b-[1.5px] border-t-0 border-gray-300'
                    }`}
                  >
                    <div className="text-bodyLg text-gray-700">
                      {project.start_date && project.end_date
                        ? `${project.start_date} ~ ${project.end_date}`
                        : project.period || ''}
                    </div>
                    <div className="text-bodyLg text-gray-700">
                      {project.project_name || project.name || ''}
                    </div>
                    <div className="text-bodyLg text-gray-700">{project.description || ''}</div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-3 gap-4 border-x-0 border-y-[1.5px] border-gray-300 bg-gray-50 px-6 py-4">
                  <div className="text-bodyLg text-gray-700">프로젝트 정보가 없습니다</div>
                  <div className="text-bodyLg text-gray-700"></div>
                  <div className="text-bodyLg text-gray-700"></div>
                  <div className="text-bodyLg text-gray-700"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 보유역량 2/2 */}
        <div className="mt-10 w-[1048px] rounded-xl border border-gray-200 p-8">
          <div className="mt-3 flex items-center self-start">
            <img
              src="/ic_skill_2.svg"
              alt="보유역량 2"
              className="z-10 mr-2 w-[35px] object-contain"
            />
            <p className="text-h1 font-medium text-gray-800">보유역량</p>
          </div>
          <div className="my-10">
            {specData.skills.length > 0 ? (
              specData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="mr-4 inline-block items-center gap-1 rounded-xl border border-mainBlue bg-subLightBlue px-4 py-2 text-h4 font-medium text-mainBlue shadow-none"
                >
                  {typeof skill === 'string' ? skill : skill.skill_name || '알 수 없는 스킬'}
                </span>
              ))
            ) : (
              <span className="text-bodyLg text-gray-500">보유 스킬이 없습니다</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecPage;
