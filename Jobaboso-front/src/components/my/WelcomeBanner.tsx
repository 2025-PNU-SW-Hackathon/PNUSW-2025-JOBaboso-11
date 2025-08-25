import React from 'react';

interface WelcomeBannerProps {
  name: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name }) => {
  return (
    <div className="relative mb-14 mt-10 flex w-[865px] items-center justify-between overflow-hidden rounded-3xl bg-white px-7 py-5 shadow-even">
      {/* 파란 원 두 개 - 이미지 뒤에 겹치게 */}
      <div className="absolute bottom-[18px] right-[70px] z-0 h-[100px] w-[100px] rounded-full bg-blue-300 opacity-50" />
      <div className="absolute bottom-[-50px] right-[-20px] z-0 h-[140px] w-[140px] rounded-full bg-blue-300 opacity-50" />
      <div className="z-10">
        <p className="text-[32px] font-semibold text-gray-600">
          안녕하세요, <span className="text-mainBlue">{name}</span> 님!
        </p>
        <p className="text-[32px] text-gray-600">학교에게 {name} 님에 대해 알려주세요.</p>
      </div>
      <img
        src="/ResumeEditBanner.png"
        alt="일러스트"
        className="z-10 w-[151px] object-contain pr-7"
      />
    </div>
  );
};

export default WelcomeBanner;
