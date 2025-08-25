export interface SignUpCompanyRequestDto {
  user_id: string;
  password: string;
  user_type: string; // "company"
  name: string;
  phone: string;
  email: string; // e.g., "user@example.com"
  company: {
    company_type: string;
    registration_name: string;
    company_name: string;
    company_address: string;
    business_license_no: string;
    is_partner: boolean;
  };
}

export interface SignUpUniversityRequestDto {
  user_id: string;
  password: string;
  user_type: string; // "university"
  name: string;
  phone: string;
  email: string; // e.g., "user@example.com"
  univ_name: string;
  Field: string;
}

export interface SignUpPersonalRequestDto {
  user_id: string;
  password: string;
  user_type: string; //personal
  name: string;
  phone: string;
  email: string; //user@example.com
  birth_date: string; //2025-07-16
  gender: string; // M or W
  profile_addr?: string | null;
}

export interface SignInRequestDto {
  user_id: string;
  password: string;
}
