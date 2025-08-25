import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DocumentViewer from '../../components/employment/DocumentViewer';

const DocumentViewerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">토큰이 없습니다</h1>
          <p className="text-gray-600">URL에 t 파라미터가 필요합니다.</p>
          <p className="mt-2 text-sm text-gray-500">예: /document-viewer?t=1755623971851</p>
        </div>
      </div>
    );
  }

  return <DocumentViewer token={token} />;
};

export default DocumentViewerPage;
