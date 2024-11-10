'use client'

export default function Header() {

  return (
    <header className="grid grid-cols-2 gap-8 items-center p-4 lg:pl-8 lg:pr-8">
          <a href="/">
            <img src="/favicon.png" alt="La Mode Collective" className="w-24 h-24 justify-self-start object-contain hover:scale-110 transition-scale duration-300" 
            />
          </a>

          <a href="/login">
            <img src="/profile.png" alt="La Mode Collective - Profile image for login" className="w-16 h-16 justify-self-end object-contain hover:scale-110 transition-scale duration-300 rounded-full" 
            />
          </a>
            
        </header>
  )
}
