import { Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-black/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-800 relative">
      <div className="container mx-auto px-6">
        <div className="flex h-24 items-center justify-between">
          {/* BONK Logo */}
          <Link href="/" className="flex items-center gap-2 group relative">
            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 transition-all duration-300">
              BONKIFY
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Transform
            </Link>
            <Link
              href="/gallery"
              className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Gallery
            </Link>
            <a
              href="https://x.com/i/communities/1939804671582818551"
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
            className="md:hidden p-3 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-all rounded-lg"
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