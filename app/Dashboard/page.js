import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Header from '../Components/Header'


export default function Closet() {
  return (
    <>
      <div className="min-h-full">


        {/* Header */}
        <Header />
        <main>
          <div className="flex flex-col items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            <h1 className="text-5xl font-bold tracking-tight text-[#D0F0C0]">Closet</h1>

          </div>
        </main>
      </div>
    </>
  )
}
