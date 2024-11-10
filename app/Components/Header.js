'use client'
import { useState, useEffect } from 'react';
import { auth, logout } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Header() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleProfileClick = () => {
    if (user) {
      window.location.href = '/Dashboard';
    } else {
      window.location.href = '/login';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login'; // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="grid grid-cols-2 gap-8 items-center p-4 lg:pl-8 lg:pr-8">
      <a href="/">
        <img src="/favicon.png" alt="La Mode Collective" className="w-24 h-24 justify-self-start object-contain hover:scale-110 transition-scale duration-300" />
      </a>

      <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
        <img
          src="/profile.png"
          alt="La Mode Collective - Profile image for login"
          className="w-16 h-16 justify-self-end object-contain hover:scale-110 transition-scale duration-300 rounded-full cursor-pointer"
          onClick={handleProfileClick}
        />
        {user && showDropdown && (
          <div className="absolute right-0 mt-0 w-32 bg-white rounded-md shadow-lg py-1 z-20">
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
