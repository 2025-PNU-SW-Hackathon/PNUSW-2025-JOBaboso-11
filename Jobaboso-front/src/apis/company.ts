import api from './api';

// 찜하기 관련 API
export const getRandomPersonalUsers = async (limit: number = 6) => {
  try {
    const response = await api.get(`/company/personal-users/random?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random personal users:', error);
    throw error;
  }
};

export const createLike = async (likeData: {
  target_user_id: string;
  message: string;
  contact_email: string;
  contact_phone: string;
  suggested_position: string;
}) => {
  try {
    const response = await api.post('/company/likes', likeData);
    return response.data;
  } catch (error) {
    console.error('Error creating like:', error);
    throw error;
  }
};

export const getLikesList = async (page: number = 1, limit: number = 6) => {
  try {
    const response = await api.get(`/company/likes?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching likes list:', error);
    throw error;
  }
};

export const deleteLike = async (likeId: number) => {
  try {
    const response = await api.delete(`/company/likes/${likeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting like:', error);
    throw error;
  }
};

// 내가 받은 회사 찜하기 목록 조회
export const getMyCompanyLikes = async () => {
  try {
    const response = await api.get('/personal/company-likes');
    return response.data;
  } catch (error) {
    console.error('Error fetching my company likes:', error);
    throw error;
  }
};
