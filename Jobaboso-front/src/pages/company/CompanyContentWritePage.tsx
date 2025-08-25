import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TagInput from '@components/common/TagInput';
import { addNewCompanyContent } from '@mocks/companyContentData';

const CompanyContentWritePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageFile: null as File | null,
    youtubeUrl: '',
    hashtags: [] as string[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHashtagsChange = (tags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: tags,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 새글 추가
    const newContent = {
      title: formData.title,
      content: formData.content,
      companyName: '부산다이나믹스', // 기본값 설정
      hashtags: formData.hashtags,
      description: formData.content.substring(0, 100) + '...', // 내용의 첫 100자
      author: '부산다이나믹스', // 기본값 설정
      tags: formData.hashtags,
    };

    addNewCompanyContent(newContent);

    // 작성 완료 후 목록 페이지로 이동
    navigate('/company/contents');
  };

  const handleCancel = () => {
    navigate('/company/contents');
  };

  return (
    <div className="my-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">기업 콘텐츠 작성하기</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 제목 */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
            제목 <span className="text-[#D84D4D]">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="제목을 입력하세요."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-0"
            required
          />
        </div>

        {/* 내용 */}
        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-700">
            내용 <span className="text-[#D84D4D]">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="내용을 입력하세요."
            rows={10}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-0"
            required
          />
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label htmlFor="image" className="mb-2 block text-sm font-medium text-gray-700">
            이미지
          </label>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
            {imagePreview ? (
              <div className="space-y-4">
                <img src={imagePreview} alt="미리보기" className="mx-auto max-h-48 rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, imageFile: null }));
                    setImagePreview(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  이미지 제거
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-gray-600">
                  이미지를 여기에 끌어다 놓거나, 파일 첨부 버튼을 클릭해주세요(최대 1장)
                </p>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  ↑ 이미지 첨부
                </label>
              </div>
            )}
          </div>
        </div>

        {/* 유튜브 링크 */}
        <div>
          <label htmlFor="youtubeUrl" className="mb-2 block text-sm font-medium text-gray-700">
            유튜브 링크
          </label>
          <input
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleInputChange}
            placeholder="첨부할 유튜브 영상의 링크를 첨부해주세요."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-0"
          />
        </div>

        {/* 해시태그 */}
        <div>
          <TagInput
            id="hashtags"
            label="해시태그"
            value={formData.hashtags}
            onChange={handleHashtagsChange}
            placeholder="해시태그를 입력하세요."
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyContentWritePage;
