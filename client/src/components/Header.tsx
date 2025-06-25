import { Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="glass sticky top-0 z-50 border-b-4 border-green-600 backdrop-blur-md transform -rotate-1 relative overflow-hidden">
      {/* Pokemon-themed floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1 right-20 w-8 h-8 opacity-25 transform rotate-45 bg-red-500 rounded-full" style={{ animation: 'sway 4s ease-in-out infinite', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1 left-40 w-6 h-6 opacity-20 transform -rotate-30 bg-blue-500 rounded-lg" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}></div>
        <div className="absolute top-2 left-80 w-5 h-5 opacity-15 transform rotate-90 bg-yellow-500 rounded-full" style={{ animation: 'crumple 5s ease-in-out infinite', animationDelay: '2s' }}></div>
        <div className="absolute bottom-2 right-60 w-7 h-7 opacity-30 transform -rotate-45 bg-green-500 rounded-lg" style={{ animation: 'wiggle 2s ease-in-out infinite', animationDelay: '0.8s' }}></div>
        <div className="absolute top-3 right-40 w-4 h-4 opacity-10 transform rotate-180 bg-purple-500 rounded-full" style={{ animation: 'bounce 3s infinite', animationDelay: '1.5s' }}></div>
      </div>
      <div className="container mx-auto px-6">
        <div className="flex h-24 items-center justify-between">
          {/* CHAOTIC Logo */}
          <Link href="/" className="flex items-center gap-4 group relative">
            {/* Pokemon card logo */}
            <div className="relative w-16 h-16">
              <div className="absolute w-12 h-12 top-1 left-1 transform rotate-6 group-hover:rotate-12 transition-all opacity-80 bg-red-500 rounded-lg border-2 border-white"></div>
              <div className="absolute w-10 h-10 top-2 left-3 transform -rotate-12 group-hover:rotate-0 transition-all z-10 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">⚡</div>
              <div className="absolute w-8 h-8 bottom-0 right-0 transform rotate-45 group-hover:-rotate-45 transition-all opacity-60 bg-blue-500 rounded-lg"></div>
            </div>
            <span className="font-display text-3xl font-bold gradient-text transform -rotate-2 hover:rotate-0 transition-transform">
              POKEIFY
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-800 hover:text-green-600 transition-colors font-display font-semibold text-lg transform -rotate-2 hover:rotate-0 px-4 py-2 hover:bg-green-50 border-2 border-transparent hover:border-green-600"
            >
              POKEIFY
            </Link>
            <Link
              href="/gallery"
              className="text-gray-800 hover:text-green-600 transition-colors font-display font-semibold text-lg transform rotate-2 hover:rotate-0 px-4 py-2 hover:bg-green-50 border-2 border-transparent hover:border-green-600"
            >
              GALLERY
            </Link>
            <a
              href="https://x.com/i/communities/1935816851721699521/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-green-600 transition-all p-3 bg-white border-2 border-gray-800 hover:scale-110 transform -rotate-3 hover:rotate-0 hover:bg-green-50"
              aria-label="Follow us on X (Twitter)"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-4 text-gray-800 hover:text-green-600 bg-white border-2 border-gray-800 transition-all hover:scale-110 transform rotate-3 hover:rotate-0 hover:bg-green-50"
            onClick={onMenuClick}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}