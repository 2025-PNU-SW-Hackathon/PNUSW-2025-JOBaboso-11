export interface Content {
  id: string;
  title: string;
  content: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  youtubeUrl?: string;
  hashtags: string[];
  // 통일된 필드들
  description?: string;
  author?: string;
  date?: string;
  time?: string;
  tags?: string[];
}
