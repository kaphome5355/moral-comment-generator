
import React, { useState, useCallback } from 'react';
import { StudentData } from './types';
import { MORAL_EDUCATION_VALUES, INITIAL_KEYWORDS_COUNT } from './constants';
import StudentCommentGenerator from './components/StudentCommentGenerator';
import { generateMoralComment } from './services/geminiService';

const App: React.FC = () => {
  const initialStudentData = (): StudentData => ({
    valueItem: MORAL_EDUCATION_VALUES[0],
    keywords: Array(INITIAL_KEYWORDS_COUNT).fill(''),
    generatedComment: '',
    isLoading: false,
    error: null,
  });

  const [studentData, setStudentData] = useState<StudentData>(initialStudentData());

  const handleDataChange = useCallback((updatedData: Partial<Omit<StudentData, 'isLoading' | 'error' | 'generatedComment'>>) => {
    setStudentData(prevData => ({ ...prevData, ...updatedData }));
  }, []);

  const handleGenerateComment = useCallback(async () => {
    setStudentData(prevData => ({ ...prevData, isLoading: true, error: null }));

    try {
      const comment = await generateMoralComment(studentData.valueItem, studentData.keywords);
      setStudentData(prevData => ({ ...prevData, generatedComment: comment, isLoading: false }));
    } catch (err) {
      console.error("Error generating comment:", err);
      const errorMessage = err instanceof Error ? err.message : "所見の生成中に不明なエラーが発生しました。";
      setStudentData(prevData => ({ ...prevData, error: errorMessage, isLoading: false }));
    }
  }, [studentData]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let content = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <title>印刷用所見</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', 'Meiryo', sans-serif; margin: 20px; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #1a202c; margin-bottom: 30px; font-size: 24px; }
            .comment-record { margin-bottom: 20px; padding-bottom: 15px; }
            p { margin-top: 0; white-space: pre-wrap; word-wrap: break-word; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>小学校道徳所見</h1>
      `;
      
      if (studentData.generatedComment.trim() !== '') {
        content += `
          <div class="comment-record">
            <p>${studentData.generatedComment.replace(/\n/g, '<br>')}</p>
          </div>
        `;
      } else {
        content += `<p>生成された所見はありません。</p>`;
      }

      content += `
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus(); // Focus new window/tab for Safari.
      // Giving a slight delay for content to render before printing
      setTimeout(() => {
        printWindow.print();
      }, 500);

    } else {
      alert("ポップアップブロックにより印刷ウィンドウを開けませんでした。設定を確認してください。");
    }
  };
  
  const handleCommentTextChange = useCallback((newText: string) => {
    setStudentData(prevData => ({ ...prevData, generatedComment: newText }));
  }, []);

  const handleClear = () => {
    setStudentData(initialStudentData());
  };


  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800">小学校道徳所見ジェネレーター</h1>
        </header>

        <div className="space-y-8">
          <StudentCommentGenerator
            studentData={studentData}
            onDataChange={handleDataChange}
            onGenerateComment={handleGenerateComment}
            onCommentTextChange={handleCommentTextChange}
          />
        </div>

        <footer className="mt-12 text-center">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handleClear}
              className="px-8 py-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition duration-150 ease-in-out"
              aria-label="入力と生成結果をクリア"
            >
              クリア
            </button>
            <button
              onClick={handlePrint}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              aria-label="生成された所見を印刷"
            >
              所見を印刷
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
