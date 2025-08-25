export interface Company {
  id: number;
  name: string;
  industry: string;
  companyType: string;
  yearsInBusiness: number;
  logo?: string;
}

// 기업 데이터
export const companies: Company[] = [
  {
    id: 1,
    name: '삼성전자',
    industry: '이동전화기 제조업',
    companyType: '대기업',
    yearsInBusiness: 57,
    logo: '/company_porfile/samsung.svg',
  },
  {
    id: 2,
    name: 'LG전자',
    industry: '통신 및 방송 장비 제조업',
    companyType: '대기업',
    yearsInBusiness: 24,
    logo: '/company_porfile/lg.svg',
  },
  {
    id: 3,
    name: '현대자동차',
    industry: '승용차 및 기타 여객용 자동차 제조업',
    companyType: '대기업',
    yearsInBusiness: 59,
    logo: '/company_porfile/hyundai.svg',
  },
  {
    id: 4,
    name: '네이버클라우드',
    industry: '포털 및 기타 인터넷 정보매개 서비스',
    companyType: '대기업',
    yearsInBusiness: 17,
    logo: '/company_porfile/navercloud.svg',
  },
  {
    id: 5,
    name: '비바리퍼블리카 (Toss)',
    industry: '그 외 기타 금융 지원 서비스업',
    companyType: '스타트업',
    yearsInBusiness: 13,
    logo: '/company_porfile/toss.svg',
  },
  {
    id: 6,
    name: '당근마켓',
    industry: '응용 소프트웨어 개발 및 공급업',
    companyType: '스타트업',
    yearsInBusiness: 11,
    logo: '/company_porfile/carrot.svg',
  },
  {
    id: 7,
    name: '부산교통공사',
    industry: '도시철도 운송업',
    companyType: '공기업',
    yearsInBusiness: 20,
    logo: '/company_porfile/busantransport.svg',
  },
];
