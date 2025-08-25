import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

const HeaderIcons = () => {
  return (
    <>
      {/* 검색 아이콘 */}
      <button className="p-2 text-gray-600 hover:text-mainBlue" aria-label="검색">
        <MagnifyingGlassIcon className="h-7 w-7" />
      </button>

      {/* 알림 아이콘 */}
      <button className="p-2 text-gray-600 hover:text-mainBlue" aria-label="알림">
        <BellIcon className="h-7 w-7" />
      </button>
    </>
  );
};

export default HeaderIcons;
