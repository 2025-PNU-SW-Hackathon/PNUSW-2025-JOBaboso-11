import { FaUser, FaBuilding, FaUniversity } from 'react-icons/fa';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import { useNavigate } from 'react-router-dom';

const SignupTypePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div className="flex w-full flex-col items-center bg-white px-4 py-10">
      <h2 className="mb-5 text-[40px] font-bold text-gray-800">회원가입</h2>
      <p className="mb-10 text-h4 text-gray-600">회원 유형에 맞게 선택해 주세요.</p>

      <div className="flex flex-wrap justify-center gap-[64px]">
        <Card
          icon={<FaUser />}
          title="개인 회원"
          description="취업이나 진로 준비를 하고 있는 학생, 구직자 등 모두가 가입할 수 있어요."
        >
          <Button onClick={() => navigate('/auth/signup/personal')}>회원가입</Button>
        </Card>

        <Card
          icon={<FaBuilding />}
          title="기업 회원"
          description="채용이나 잡메이트와 협력을 원하는 기업이 가입해요. 구직자 정보 열람이 가능해요."
        >
          <Button onClick={() => navigate('/auth/signup/company')}>회원가입</Button>
        </Card>

        <Card
          icon={<FaUniversity />}
          title="대학교 교직원 회원"
          description="대학교에서 진로·취업 지원을 담당하는 교직원이 가입하면 좋아요."
        >
          <Button onClick={() => navigate('/auth/signup/university')}>회원가입</Button>
        </Card>
      </div>
    </div>
  );
};

export default SignupTypePage;
