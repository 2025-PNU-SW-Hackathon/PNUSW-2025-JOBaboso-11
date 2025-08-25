import { useState, useEffect } from 'react';
import communityData from './CommunityMockData.json';
import SearchBar from '../../components/lounge/SearchBar';
import TabBar from '../../components/lounge/TabBar';
import PostCard from '../../components/lounge/PostCard';
import Pagination from '../../components/common/Pagination';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['전체', 'QnA', '스터디', '잡담', '멘토링'];
  const postsPerPage = 10;

  // 탭 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // 데이터 필터링
  useEffect(() => {
    let filtered =
      activeTab === '전체'
        ? communityData
        : communityData.filter((item) => item.type === activeTab);

    // 검색어 필터링 추가
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title.includes(searchQuery) ||
          item.body.includes(searchQuery) ||
          item.tags.some((tag: string) => tag.includes(searchQuery))
      );
    }

    setFilteredData(filtered);
    setTotalCount(filtered.length);
  }, [activeTab, searchQuery]);

  // 현재 페이지 데이터 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / postsPerPage);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 검색 처리 함수
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // 작성하기 클릭 처리 함수
  const handleWriteClick = () => {
    // TODO: 글 작성 페이지로 이동 또는 모달 열기
    console.log('글 작성하기 클릭');
  };

  return (
    <div className="w-full">
      {/* 검색창 */}
      <SearchBar onSearch={handleSearch} onWriteClick={handleWriteClick} />

      {/* 탭 */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 건수 & 정렬 */}
      <div className="mt-4 flex items-center justify-between pb-4">
        <div className="text-h4">
          <span className="text-gray-800">총 </span>
          <span className="font-semibold text-blue-500">{totalCount.toLocaleString()}</span>
          <span className="text-gray-800">건</span>
        </div>
        <div className="text-caption text-gray-500">
          모든 글들이 최신순으로 정렬되어 보여집니다.
        </div>
      </div>

      {/* 글 목록 */}
      <div className="">
        {currentPosts.map((post, index) => (
          <PostCard key={index} post={post} activeTab={activeTab} />
        ))}
      </div>

      {/* 검색 결과가 없을 때 */}
      {currentPosts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-bodyLg text-gray-500">
            {searchQuery.trim() ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
          </p>
        </div>
      )}

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CommunityPage;
