import React, { useEffect, useState } from 'react';

const CelebrationModal = ({ show, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (show) {
      setFadeOut(false);
      setVisible(true);
    }
  }, [show]);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 200);
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transition-all duration-300 ${fadeOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">축하합니다!</h2>
        <p className="text-gray-600 mb-1 font-medium">10개의 스탬프를 다 모으셨어요!</p>
        <p className="text-sm text-gray-500 mb-6">명예의 전당에 이름을 올리셨습니다 🏆</p>
        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl">⭐</span>
          ))}
        </div>
        <button
          onClick={handleClose}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition text-lg"
        >
          고마워! 🙌
        </button>
      </div>
    </div>
  );
};

export default CelebrationModal;
