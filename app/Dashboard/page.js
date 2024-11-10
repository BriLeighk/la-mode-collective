
import { useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Header from '../Components/Header';
import OutfitModal from './OutfitModal'; // Ensure the path is correct

export default function Closet() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="min-h-full">
        {/* Header */}
        <Header />
        <main>
          <div className="flex flex-col items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold tracking-tight text-[#D0F0C0]">Closet</h1>

            {/* Add New Outfit Button */}
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-4 py-2 bg-[#A2E8B8] text-[#4D5D53] font-semibold rounded-lg shadow-md hover:bg-[#88c9a7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
            >
              Add New Item to Closet
            </button>

            {/* Outfit Modal */}
            <OutfitModal isVisible={showModal} onClose={() => setShowModal(false)} />
          </div>
        </main>
      </div>
    </>
  );
}
