import { Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="glass sticky top-0 z-50 border-b-4 border-green-600 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z"/>
              </svg>
            </div>
            <span className="font-display text-3xl font-bold gradient-text transform -rotate-1 hover:rotate-0 transition-transform">
              GORBIFY
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-800 hover:text-green-600 transition-colors font-display font-semibold text-lg transform -rotate-1 hover:rotate-0 px-4 py-2 hover:bg-green-50"
            >
              GORBIFY
            </Link>
            <Link
              href="/gallery"
              className="text-gray-800 hover:text-green-600 transition-colors font-display font-semibold text-lg transform rotate-1 hover:rotate-0 px-4 py-2 hover:bg-green-50"
            >
              GALLERY
            </Link>
            <a
              href="https://x.com/i/communities/1930184588879335841"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-green-600 transition-all p-3 bg-white/50 backdrop-blur-sm rounded-full hover:scale-110 transform hover:bg-green-50"
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
            className="md:hidden p-4 text-gray-800 hover:text-green-600 bg-white/50 backdrop-blur-sm rounded-full transition-all hover:scale-110 transform hover:bg-green-50"
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
