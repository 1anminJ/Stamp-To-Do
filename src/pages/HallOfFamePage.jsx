import React, { useEffect, useState } from 'react';
import { hallOfFameAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HallOfFamePage = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [myRecord, setMyRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([hallOfFameAPI.getAll(), hallOfFameAPI.getMe()])
      .then(([allRes, meRes]) => {
        setList(allRes.data);
        setMyRecord(meRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderStars = (count) => {
    const stars = Math.min(count, 10);
    return (
      <span className="text-yellow-400">
        {'⭐'.repeat(stars)}
        {count > 10 && <span className="text-sm text-gray-500 ml-1">+{count - 10}</span>}
      </span>
    );
  };

  const rankBadge = (i) => {
    if (i === 0) return <span className="text-2xl">🥇</span>;
    if (i === 1) return <span className="text-2xl">🥈</span>;
    if (i === 2) return <span className="text-2xl">🥉</span>;
    return <span className="text-gray-500 font-bold text-sm w-8 text-center">{i + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800">명예의 전당</h1>
          <p className="text-gray-500 mt-2">스탬프 10개를 달성한 최고의 사용자들입니다!</p>
        </div>

        {/* 내 기록 */}
        {myRecord && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-5 mb-6 shadow-lg">
            <p className="text-indigo-100 text-sm mb-1">나의 기록</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">{myRecord.displayName}</p>
                <p className="text-indigo-200 text-sm mt-1">
                  마지막 달성: {myRecord.lastAchievedDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{myRecord.achievementCount}<span className="text-lg ml-1">회</span></p>
                <p className="text-indigo-200 text-sm">달성</p>
              </div>
            </div>
          </div>
        )}

        {/* 순위표 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">전체 순위</h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">⏳</div>
              <p>불러오는 중...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🌟</div>
              <p className="font-medium text-gray-600">아직 등록된 달성자가 없습니다</p>
              <p className="text-sm mt-2">스탬프 10개를 모아 첫 번째 달성자가 되어보세요!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {list.map((entry, i) => (
                <div key={entry.id}
                  className={`px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition ${entry.userId === user?.userId ? 'bg-indigo-50' : ''}`}>
                  <div className="flex items-center justify-center w-10 flex-shrink-0">
                    {rankBadge(i)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      {entry.displayName}
                      {entry.userId === user?.userId && (
                        <span className="text-xs bg-indigo-100 text-primary px-2 py-0.5 rounded-full font-medium">나</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      마지막 달성: {entry.lastAchievedDate}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="mb-1">{renderStars(entry.achievementCount)}</div>
                    <p className="text-sm font-bold text-gray-700">{entry.achievementCount}회 달성</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!myRecord && !loading && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
            <p className="text-yellow-700 font-medium">아직 명예의 전당에 등록되지 않으셨습니다</p>
            <p className="text-yellow-600 text-sm mt-1">스탬프를 10개 모아 명예의 전당에 이름을 올려보세요! ⭐</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFamePage;
