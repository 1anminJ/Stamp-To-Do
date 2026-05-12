import React, { useState, useEffect } from 'react';
import { hofService, stampService } from '../services/storage';
import { useAuth } from '../context/AuthContext';

const HallOfFamePage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stamp, setStamp] = useState({ stampCount: 0 });

  useEffect(() => {
    setRecords(hofService.getAll());
    setStamp(stampService.get());
  }, []);

  const totalAchievements = records.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800">명예의 전당</h1>
          <p className="text-gray-500 mt-2">스탬프 10개를 달성한 나의 기록들</p>
        </div>

        {/* 나의 달성 요약 카드 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <p className="text-indigo-100 text-sm mb-1">{user?.displayName}님의 기록</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{totalAchievements}<span className="text-lg font-normal ml-1">회 달성</span></p>
              <p className="text-indigo-200 text-sm mt-1">
                {totalAchievements === 0
                  ? '아직 달성 기록이 없어요'
                  : `마지막 달성: ${records[0]?.achievedAt}`}
              </p>
            </div>
            <div className="text-5xl opacity-80">
              {totalAchievements === 0 ? '🌱' : totalAchievements < 3 ? '🌟' : totalAchievements < 7 ? '🏅' : '👑'}
            </div>
          </div>

          {/* 현재 진행 중인 스탬프 */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-indigo-100 text-xs mb-2">현재 진행 중</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < stamp.stampCount ? 'text-yellow-300' : 'text-white/30'}`}>⭐</span>
                ))}
              </div>
              <span className="text-white text-sm font-bold">{stamp.stampCount}/10</span>
            </div>
          </div>
        </div>

        {/* 달성 히스토리 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">달성 히스토리</h2>
            <span className="text-sm text-gray-400">{totalAchievements}회</span>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🌟</div>
              <p className="font-medium text-gray-600">아직 달성 기록이 없습니다</p>
              <p className="text-sm mt-2">스탬프 10개를 모아 첫 번째 달성자가 되어보세요!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {records.map((record, i) => (
                <div key={record.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition">
                  <div className="text-2xl flex-shrink-0">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{record.achievementCount}번째 달성</p>
                    <p className="text-sm text-gray-500 mt-0.5">달성일: {record.achievedAt}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <span key={j} className="text-yellow-400 text-xs">⭐</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 동기부여 메시지 */}
        {totalAchievements === 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
            <p className="text-yellow-700 font-medium">아직 달성 기록이 없어요! 💪</p>
            <p className="text-yellow-600 text-sm mt-1">
              매일 할 일을 모두 완료해서 스탬프를 모아보세요. 10개가 되면 여기에 기록됩니다!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFamePage;
