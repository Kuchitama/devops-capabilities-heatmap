import React, { useState, useRef } from 'react';
import { parseCapabilityCsv } from '../utils/csvUtils';
import ProgressBar from './ProgressBar';

interface CsvUploaderProps {
  onDataLoad: (data: Record<string, number>) => void;
  onReset: () => void;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ onDataLoad, onReset }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);
    return interval;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    try {
      setIsUploading(true);
      const progressInterval = simulateProgress();

      const data = await parseCapabilityCsv(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onDataLoad(data);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

      localStorage.setItem('capabilityLevels', JSON.stringify(data));
    } catch (error) {
      console.error('Error loading CSV:', error);
      alert('CSVファイルの読み込みに失敗しました');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    if (window.confirm('習熟度データをリセットしますか？')) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFileName('');
      localStorage.removeItem('capabilityLevels');
      onReset();
    }
  };

  const handleDownloadSample = () => {
    const sampleFileUrl = './sample.csv';
    
    // aタグを使用してダウンロードを実行
    const link = document.createElement('a');
    link.href = sampleFileUrl;
    link.download = 'sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-grow">
            <label className="block font-medium">
              CSVファイルをアップロード:
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:bg-blue-500 file:text-white
                           hover:file:bg-blue-600 disabled:opacity-50"
              />
            </label>
            {selectedFileName && (
              <p className="text-sm text-gray-600 mt-1">
                選択されたファイル: {selectedFileName}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadSample}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              サンプルCSV
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                       transition-colors whitespace-nowrap"
              disabled={isUploading}
            >
              データリセット
            </button>
          </div>
        </div>

        {isUploading && (
          <div className="mt-2">
            <ProgressBar progress={uploadProgress} />
            <p className="text-sm text-gray-600 mt-1 text-center">
              {uploadProgress}% 完了
            </p>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>※ CSVフォーマット: capability,level (カンマ区切り)</p>
          <p>※ サンプルCSVをダウンロードして、フォーマットを確認できます</p>
        </div>
      </div>
    </div>
  );
};

export default CsvUploader;
