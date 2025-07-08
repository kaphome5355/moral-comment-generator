export const generateMoralComment = async (valueItem: string, keywords: string[]): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/generate-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ valueItem, keywords }),
    });

    const data = await response.json();

    if (!response.ok) {
      // サーバーからのエラーメッセージ（data.error）を使用してエラーをスロー
      throw new Error(data.error || `サーバーエラーが発生しました (ステータス: ${response.status})`);
    }

    if (data.comment) {
      return data.comment;
    } else {
      throw new Error("APIから有効なテキスト応答がありませんでした。");
    }
  } catch (error) {
    console.error("Error calling Netlify function:", error);
    const message = error instanceof Error ? error.message : "不明なエラーが発生しました。";
    // UIに表示するエラーメッセージを一貫させるため、ここで接頭辞を追加します。
    throw new Error(`所見の生成に失敗しました: ${message}`);
  }
};
