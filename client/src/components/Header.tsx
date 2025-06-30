import { Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-red-600 via-red-700 to-yellow-500 sticky top-0 z-50 border-b-4 border-yellow-400 backdrop-blur-md relative overflow-hidden shadow-lg">
      {/* Floating Chinese Elements in Header */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1 right-20 w-6 h-6 text-yellow-400 opacity-70 text-lg font-bold" style={{ animation: 'swayScale 5s ease-in-out infinite', animationDelay: '1s' }}>★</div>
        <div className="absolute bottom-1 left-40 w-5 h-5 text-yellow-400 opacity-65 text-sm font-bold" style={{ animation: 'wiggleFloat 4s ease-in-out infinite', animationDelay: '0.5s' }}>中</div>
        <div className="absolute top-2 left-80 w-4 h-4 text-yellow-400 opacity-60 text-lg font-bold" style={{ animation: 'bounceSpin 6s ease-in-out infinite', animationDelay: '2s' }}>☭</div>
        <div className="absolute bottom-2 right-60 w-5 h-5 text-yellow-400 opacity-75 text-sm font-bold" style={{ animation: 'floatSpin 7s ease-in-out infinite reverse', animationDelay: '0.8s' }}>华</div>
      </div>
      <div className="container mx-auto px-6">
        <div className="flex h-24 items-center justify-between">
          {/* CHAOTIC Logo */}
          <Link href="/" className="flex items-center gap-2 group relative">
            <img 
              src="/title.png" 
              alt="Chinaify"
              className="h-12 md:h-16 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-white hover:text-yellow-200 transition-colors font-display font-semibold text-lg transform -rotate-2 hover:rotate-0 px-4 py-2 hover:bg-white/20 border-2 border-transparent hover:border-yellow-300 rounded-lg"
            >
              中华化 CHINAIFY
            </Link>
            <Link
              href="/gallery"
              className="text-white hover:text-yellow-200 transition-colors font-display font-semibold text-lg transform rotate-2 hover:rotate-0 px-4 py-2 hover:bg-white/20 border-2 border-transparent hover:border-yellow-300 rounded-lg"
            >
              图片库 GALLERY
            </Link>
            <a
              href="https://x.com/i/communities/1937964533370204493"
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