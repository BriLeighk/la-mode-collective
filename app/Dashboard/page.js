"use client";
import { useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ForwardIcon, BackwardIcon } from '@heroicons/react/24/outline';
import Header from '../Components/Header';
import OutfitModal from './OutfitModal'; // Ensure the path is correct
import DoubleDoors from '../Components/DoubleDoors';
import Drawers from '../Components/Drawers'; // Ensure the path is correct

export default function Closet() {
  const [showModal, setShowModal] = useState(false);

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
            <Drawers />

            {/* Add New Outfit Button */}
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-4 py-2 bg-[#A2E8B8] text-[#4D5D53] font-semibold rounded-lg shadow-md hover:bg-[#88c9a7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
            >
              Upload Item to Wardrobe
            </button>

            <OutfitModal isVisible={showModal} onClose={() => setShowModal(false)} />
          </div>
        </main>
      </div>
    </>
  );
}
