// components/TouchTable.tsx
import React from 'react';

export interface TouchRow {
  id: number;
  company: string;
  position: string;
  manager: string;
  date: string;
}

interface TouchTableProps {
  rows: TouchRow[];
}

export const TouchTable: React.FC<TouchTableProps> = ({ rows }) => {
  return (
    <div className="overflow-hidden">
      <table className="w-full border-b border-t border-gray-400 text-left text-h4 text-gray-800">
        <thead className="bg-gray-100">
          <tr>
            <th className="h-[50px] px-4 align-middle">
              {' '}
              <input type="checkbox" />{' '}
            </th>
            <th className="h-[50px] px-4 align-middle">기업명</th>
            <th className="h-[50px] px-4 align-middle">제안 포지션</th>
            <th className="h-[50px] px-4 align-middle">채용 담당자</th>
            <th className="h-[50px] px-4 align-middle">제안 일시</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="h-[88px] border-t border-gray-400 hover:bg-gray-50">
              <td className="p-4">
                <input type="checkbox" className="h-4 w-4 accent-blue-600" />
              </td>
              <td className="p-4 font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-300" />
                  {row.company}
                </div>
              </td>
              <td className="p-4 text-gray-700">{row.position}</td>
              <td className="p-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <span>{row.manager}</span>
                  <button className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100">
                    정보 보기
                  </button>
                </div>
              </td>
              <td className="p-4 text-gray-700">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
