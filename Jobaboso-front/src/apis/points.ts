import axios from 'axios';

interface PointsResponse {
  user_id: string;
  name: string;
  current_points: string;
}

interface PointsChangeRequest {
  points_change: number;
}

// 포인트 조회 API
export const getPoints = async (): Promise<string> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get<PointsResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/test/points`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.current_points;
};

// 게시물 열 때 포인트 차감 API
export const deductPointsForPost = async (pointsChange: number = -10): Promise<void> => {
  const token = localStorage.getItem('access_token');
  await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/test/points?points_change=${pointsChange}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
