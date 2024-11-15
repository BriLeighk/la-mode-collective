'use client';

import Image from "next/image";
import Aos from "aos";
import "aos/dist/aos.css";
import About from "./Components/About";
import Header from "./Components/Header";
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Aos.init({ duration: 2000 });
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-screen">
        
        <div className="flex flex-col gap-8 row-start-2 p-8 items-center sm:items-start">
          <main className="flex flex-col gap-8 items-center sm:items-start">
            <h1 className="text-7xl font-bold text-[#d0f0c0] mx-auto lg:text-8xl">La Mode ✦ Collective</h1>
            <p className="text-4xl lg:text-5xl text-[#d0f0c0] mx-auto pb-14">
              Your Personal Wardrobe, Elegantly Curated ✦
            </p>
            <div className="flex flex-col items-center lg:w-[calc(100%-24rem)]">
              <ol className="max-w-lg list-inside list-decimal text-md lg:text-lg text-center sm:text-left font-[family-name:var(--font-bodoni-moda)]">
                <p>
                  Discover a revolutionary approach to styling, where your wardrobe is reimagined in a digital space designed just for you. Effortlessly create, curate, and find inspiration all from the comfort of your personalized virtual closet.
                </p>
              </ol>
            </div>
            {/* Buttons */}
            <div className="flex justify-end w-[calc(100%-2rem)] lg:w-[calc(100%-24rem)] gap-4 sm:flex-row mt-16">
              <a
                className="rounded-full border border-solid border-transparent text-[#3D4941] transition-colors flex items-center justify-center bg-[#d0f0c0] text-background gap-2 dark:hover:bg-[#9AB28E] text-md h-8 px-4"
                href="/login"
              >
                ✦ Start Your Style Journey
              </a>
              <a
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#3D4941] dark:hover:bg-[#3D4941] hover:border-transparent text-md h-8 px-4 sm:min-w-42"
                href={user ? "/Dashboard" : "/login"}
              >
                Explore My Closet
              </a>
            </div>
          </main>
        </div>
        <About />
        
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
      </div>
    </>
  );
}
