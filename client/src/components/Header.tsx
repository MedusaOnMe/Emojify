import { Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-red-400 via-blue-400 to-yellow-400 sticky top-0 z-50 border-b-4 border-yellow-400 backdrop-blur-md transform -rotate-1 relative overflow-hidden shadow-lg">
      {/* Floating Pokemon Images in Header */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="/one.png" alt="" className="absolute top-1 right-20 w-6 h-6 opacity-40 transform rotate-45" style={{ animation: 'sway 4s ease-in-out infinite', animationDelay: '1s' }} />
        <img src="/two.png" alt="" className="absolute bottom-1 left-40 w-5 h-5 opacity-35 transform -rotate-30" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }} />
        <img src="/three.png" alt="" className="absolute top-2 left-80 w-4 h-4 opacity-30 transform rotate-90" style={{ animation: 'bounce 5s ease-in-out infinite', animationDelay: '2s' }} />
        <img src="/four.png" alt="" className="absolute bottom-2 right-60 w-5 h-5 opacity-45 transform -rotate-45" style={{ animation: 'wiggle 2s ease-in-out infinite', animationDelay: '0.8s' }} />
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
            <span className="font-display text-3xl font-bold bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent transform -rotate-2 hover:rotate-0 transition-transform drop-shadow-lg">
              POKEIFY
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-white hover:text-yellow-200 transition-colors font-display font-semibold text-lg transform -rotate-2 hover:rotate-0 px-4 py-2 hover:bg-white/20 border-2 border-transparent hover:border-yellow-300 rounded-lg"
            >
              POKEIFY
            </Link>
            <Link
              href="/gallery"
              className="text-white hover:text-yellow-200 transition-colors font-display font-semibold text-lg transform rotate-2 hover:rotate-0 px-4 py-2 hover:bg-white/20 border-2 border-transparent hover:border-yellow-300 rounded-lg"
            >
              POKEDEX
            </Link>
            <a
              href="https://x.com/i/communities/1935816851721699521/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-200 transition-all p-3 bg-white/20 border-2 border-yellow-300 hover:scale-110 transform -rotate-3 hover:rotate-0 hover:bg-white/30 rounded-lg"
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
            className="md:hidden p-4 text-white hover:text-yellow-200 bg-white/20 border-2 border-yellow-300 transition-all hover:scale-110 transform rotate-3 hover:rotate-0 hover:bg-white/30 rounded-lg"
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