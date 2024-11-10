'use client'
import { useState, useEffect } from 'react';
import { auth, logout } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function Header() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const db = getFirestore();
      const storage = getStorage();
      const imagesCollection = collection(db, 'images'); // Assuming 'images' is your collection name
      const imageDocs = await getDocs(imagesCollection);

      const urls = await Promise.all(
        imageDocs.docs.map(async (doc) => {
          const imageName = doc.data().name; // Assuming 'name' is the field with the image name
          const imageRef = ref(storage, imageName);
          return await getDownloadURL(imageRef);
        })
      );

      setImageUrls(urls);
    };

    fetchImages();
  }, []);

  const handleProfileClick = () => {
    if (typeof window !== 'undefined') {
      if (user) {
        window.location.href = '/Dashboard';
      } else {
        window.location.href = '/login';
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login'; // Redirect to login page after logout
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="grid grid-cols-2 items-center p-4">
      <a href="/">
        <img src="/logo.png" alt="La Mode Collective" className="w-16 h-16 justify-self-start ml-10 object-contain hover:scale-110 transition-scale duration-300" />
      </a>

      <div className="relative justify-self-end mr-10" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
        <img
          src="/profile.png"
          alt="La Mode Collective - Profile image for login"
          className="w-16 h-16 justify-self-end  object-contain hover:scale-110 transition-scale duration-300 rounded-full"
          onClick={handleProfileClick}
        />
        {user && showDropdown && (
          <div className="absolute right-2 mt-0 w-32 bg-[#D3D6D1] rounded-md shadow-lg py-1 z-20">
            {imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Image ${index}`} className="w-16 h-16 object-contain" />
            ))}
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
