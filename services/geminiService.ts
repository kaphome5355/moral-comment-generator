
export const generateMoralComment = async (valueItem: string, keywords: string[]): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/generate-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ valueItem, keywords }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'サーバーからの応答が不正です。' }));
      throw new Error(errorData.error || `サーバーエラーが発生しました (ステータス: ${response.status})`);
    }

    const data = await response.json();
    if (data.comment) {
      return data.comment;
    } else {
      throw new Error("APIから有効なテキスト応答がありませんでした。");
    }
  } catch (error) {
    console.error("Error calling Netlify function:", error);
    if (error instanceof Error) {
      throw new Error(`所見の生成に失敗しました: ${error.message}`);
    }
    throw new Error("所見の生成中に不明なエラーが発生しました。");
  }
};
