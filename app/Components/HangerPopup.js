import React from 'react';

function HangerPopup({ isVisible, pair, onClose }) {
  if (!isVisible || !pair) return null;

  return (
    <div
      className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 p-6 rounded-lg shadow-lg z-50 w-96"
    >
      <div className="text-center">
        <h2 className="text-xl text-[#4D5D53] font-bold mb-4">Outfit Pair</h2>
        <div className="flex justify-center items-center space-x-4">
          <img src={pair.top} alt="Top" className="w-32 h-32 object-cover" />
          <img src={pair.bottom} alt="Bottom" className="w-32 h-32 object-cover" />
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-[#4D5D53] text-[#D0F0C0] font-semibold rounded-lg shadow-md hover:bg-[#6ea190] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
      >
        Close
      </button>
    </div>
  );
}

export default HangerPopup; 