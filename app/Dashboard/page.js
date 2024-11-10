"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '../Components/Header';
import OutfitModal from './OutfitModal'; // Ensure the path is correct

// Dynamically import components that rely on the window object
const DoubleDoors = dynamic(() => import('../Components/DoubleDoors'), { ssr: false });
const Drawers = dynamic(() => import('../Components/Drawers'), { ssr: false });

export default function Closet() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpload = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      {/* Double Doors Animation */}
      <DoubleDoors />
      
      {/* Header */}
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <main className="flex flex-col items-center mx-auto max-w-7xl">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold tracking-tight text-[#D0F0C0]">Closet</h1>
            <Drawers refreshKey={refreshKey} />

            {/* Add New Outfit Button */}
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-4 py-2 bg-[#4D5D53] text-[#D0F0C0] hover:text-[#4D5D53] font-semibold rounded-lg shadow-md hover:bg-[#D0D0D0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
            >
              Upload Item to Wardrobe
            </button>

            <OutfitModal isVisible={showModal} onClose={() => setShowModal(false)} onUpload={handleUpload} />
          </div>
        </main>
      </div>
    </>
  );
}
