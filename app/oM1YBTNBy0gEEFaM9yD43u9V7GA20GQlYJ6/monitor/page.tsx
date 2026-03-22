"use client";

import React, { useState, useEffect } from "react";

// --- 型定義 ---
type Venue = {
  id: string;
  name: string;
};

type QueueData = {
  calling: string[];
  preparing: string[];
};

// --- モックデータ ---
const VENUES: Venue[] = [
  { id: "v1", name: "A会場 (メインホール)" },
  { id: "v2", name: "B会場 (サブホール)" },
  { id: "v3", name: "C会場 (屋外テント)" },
];

// 会場ごとのダミーデータ（件数を変えてetc.の挙動を確認できるようにしています）
const MOCK_QUEUE_DATA: Record<string, QueueData> = {
  v1: {
    calling: ["A-012", "A-013", "A-014", "A-015", "A-016", "A-017"], // 6件 (5件上限なのでetc.になる)
    preparing: ["A-018", "A-019", "A-020", "A-021", "A-022", "A-023", "A-024", "A-025", "A-026", "A-027", "A-028"], // 11件 (10件上限なのでetc.になる)
  },
  v2: {
    calling: ["B-105", "B-106"], // 2件 (そのまま表示)
    preparing: ["B-107", "B-108", "B-109", "B-110"], // 4件 (そのまま表示)
  },
  v3: {
    calling: ["C-088", "C-089", "C-090", "C-091", "C-092"], // 5件 (上限ピッタリ)
    preparing: ["C-093", "C-094", "C-095", "C-096", "C-097", "C-098", "C-099", "C-100", "C-101", "C-102"], // 10件 (上限ピッタリ)
  },
};

// --- 設定値 ---
const MAX_CALLING_ITEMS = 5;  // 呼び出し中の最大表示件数（1列）
const MAX_PREPARING_ITEMS = 10; // 準備中の最大表示件数（2列）

// --- メインコンポーネント ---
export default function QueueSignagePage() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [queueData, setQueueData] = useState<QueueData>({ calling: [], preparing: [] });

  // 会場が選択されたらデータをセットする（実運用ではここでAPIから取得します）
  useEffect(() => {
    if (selectedVenue) {
      setQueueData(MOCK_QUEUE_DATA[selectedVenue.id]);
      
      // 実運用に向けたポーリング（定期更新）のモックアップ
      // const interval = setInterval(() => fetchQueueData(), 5000);
      // return () => clearInterval(interval);
    }
  }, [selectedVenue]);

  // --- ロジック: 溢れ処理 (etc. への置換) ---
  const formatQueueList = (uidList: string[], maxCount: number): string[] => {
    if (uidList.length <= maxCount) {
      return uidList;
    }
    // 上限を超える場合、(上限 - 1) 件まで取得し、最後に 'etc.' を追加
    const visibleList = uidList.slice(0, maxCount - 1);
    visibleList.push("etc.");
    return visibleList;
  };

  const displayCalling = formatQueueList(queueData.calling, MAX_CALLING_ITEMS);
  const displayPreparing = formatQueueList(queueData.preparing, MAX_PREPARING_ITEMS);

  // ==========================================
  // 画面1: 会場選択画面
  // ==========================================
  if (!selectedVenue) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">サイネージ用 会場選択</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {VENUES.map((venue) => (
            <button
              key={venue.id}
              onClick={() => setSelectedVenue(venue)}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-4 group"
            >
              <span className="text-2xl font-bold text-gray-700 group-hover:text-blue-600">
                {venue.name}
              </span>
              <span className="text-sm text-gray-500">表示を開始する</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // 画面2: 呼び出し番号表示画面（サイネージメイン）
  // ==========================================
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-sans">
      {/* 16:9 アスペクト比固定コンテナ */}
      <div className="w-full max-w-[1920px] max-h-screen aspect-video bg-slate-900 text-white flex relative overflow-hidden shadow-2xl">
        
        {/* 【左側】 準備中エリア (幅60%) */}
        <div className="w-[60%] p-8 lg:p-12 flex flex-col border-r-4 border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-4 mb-8 lg:mb-12">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-300 tracking-widest">
              準備中
            </h2>
            <span className="text-xl lg:text-3xl text-gray-400">PREPARING</span>
          </div>
          
          {/* 準備中リスト (2列グリッド) */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:gap-y-8 flex-grow content-start">
            {displayPreparing.map((uid, index) => (
              <div 
                key={index} 
                className={`flex justify-center items-center py-2 lg:py-4 rounded-lg ${uid === 'etc.' ? 'bg-transparent' : 'bg-slate-700/50'}`}
              >
                <span className={`font-bold tracking-wider ${uid === 'etc.' ? 'text-4xl lg:text-5xl text-gray-400' : 'text-6xl lg:text-[5.5rem] leading-none'}`}>
                  {uid}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 【右側】 呼び出し中エリア (幅40%) */}
        <div className="w-[40%] p-8 lg:p-12 flex flex-col bg-slate-900">
          <div className="flex items-center justify-center gap-4 mb-8 lg:mb-12 pb-4 border-b-4 border-yellow-500/30">
            <h2 className="text-5xl lg:text-7xl font-black text-yellow-400 tracking-widest drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              呼び出し中
            </h2>
          </div>
          
          {/* 呼び出し中リスト (1列) */}
          <div className="flex flex-col gap-4 lg:gap-8 flex-grow items-center content-start">
            {displayCalling.map((uid, index) => (
              <div 
                key={index} 
                className="w-full flex justify-center items-center py-2"
              >
                <span className={`font-black tracking-widest drop-shadow-lg ${uid === 'etc.' ? 'text-5xl lg:text-6xl text-yellow-600/70' : 'text-[5rem] lg:text-[7.5rem] leading-none text-yellow-300'}`}>
                  {uid}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 隠し「戻る」ボタン（右下） - 誤操作防止のため透明度を下げています */}
        <button
          onClick={() => setSelectedVenue(null)}
          className="absolute bottom-4 right-4 opacity-10 hover:opacity-100 transition-opacity bg-white/20 px-6 py-3 rounded-full text-white text-lg backdrop-blur-sm"
          title="会場選択へ戻る"
        >
          終了して戻る
        </button>
      </div>
    </div>
  );
}
