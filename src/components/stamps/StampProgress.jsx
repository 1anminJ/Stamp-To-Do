import React from 'react';

const StampProgress = ({ stampCount }) => {
  const count = stampCount || 0;
  const pct = Math.round((count / 10) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-xl">🏅</span> 스탬프 현황
        </h3>
        <span className="text-sm font-bold text-primary">{count}/10</span>
      </div>

      {/* 스탬프 슬롯 */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`aspect-square rounded-full flex items-center justify-center text-lg border-2 transition-all ${
            i < count
              ? 'bg-yellow-400 border-yellow-500 shadow-md scale-105'
              : 'bg-gray-100 border-gray-200 text-gray-300'
          }`}>
            {i < count ? '⭐' : '○'}
          </div>
        ))}
      </div>

      {/* 진행 바 */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 text-center">
        {count === 0
          ? '오늘의 할 일을 모두 완료하면 스탬프를 획득해요!'
          : count < 10
          ? `${10 - count}개 더 모으면 명예의 전당에 등록됩니다!`
          : ''}
      </p>
    </div>
  );
};

export default StampProgress;
