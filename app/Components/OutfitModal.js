import React from 'react';

function OutfitModal({ isVisible, onClose, pair }) {
  if (!isVisible || !pair) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2">Close</button>
        <div className="flex">
          <img src={pair.top} alt="Top" className="w-1/2 h-auto" />
          <img src={pair.bottom} alt="Bottom" className="w-1/2 h-auto" />
        </div>
      </div>
    </div>
  );
}

export default OutfitModal; 