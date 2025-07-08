import React from 'react';
import { StudentData } from '../types';
import { MORAL_EDUCATION_VALUES, INITIAL_KEYWORDS_COUNT } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface StudentCommentGeneratorProps {
  studentData: StudentData;
  onDataChange: (updatedData: Partial<Omit<StudentData, 'isLoading' | 'error' | 'generatedComment'>>) => void;
  onGenerateComment: () => Promise<void>;
  onCommentTextChange: (newText: string) => void;
}

const StudentCommentGenerator: React.FC<StudentCommentGeneratorProps> = ({
  studentData,
  onDataChange,
  onGenerateComment,
  onCommentTextChange,
}) => {
  const handleValueItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDataChange({ valueItem: e.target.value });
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...studentData.keywords];
    newKeywords[index] = value;
    onDataChange({ keywords: newKeywords });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-700 mb-6">所見生成</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="valueItem" className="block text-sm font-medium text-slate-600 mb-1">
            価値項目:
          </label>
          <select
            id="valueItem"
            value={studentData.valueItem}
            onChange={handleValueItemChange}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            {MORAL_EDUCATION_VALUES.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          所見に含めたい具体的な言葉（最大{INITIAL_KEYWORDS_COUNT}個）:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {studentData.keywords.map((keyword, index) => (
            <input
              key={index}
              type="text"
              placeholder={`言葉${index + 1}`}
              value={keyword}
              onChange={e => handleKeywordChange(index, e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          ))}
        </div>
      </div>

      <button
        onClick={onGenerateComment}
        disabled={studentData.isLoading}
        className="w-full mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {studentData.isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">生成中...</span>
          </>
        ) : (
          '所見を生成'
        )}
      </button>

      {studentData.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
          エラー: {studentData.error}
        </div>
      )}

      <div>
        <label htmlFor="generatedComment" className="block text-sm font-medium text-slate-600 mb-1">
          生成された所見:
        </label>
        <textarea
          id="generatedComment"
          value={studentData.generatedComment}
          onChange={(e) => onCommentTextChange(e.target.value)}
          rows={6}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="ここに生成された所見が表示されます..."
        />
        <p className="text-xs text-slate-500 mt-1">約120字程度で生成されます。必要に応じて手修正してください。</p>
      </div>
    </div>
  );
};

export default StudentCommentGenerator;