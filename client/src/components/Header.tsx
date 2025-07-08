import { Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 sticky top-0 z-50 border-b-4 border-black relative overflow-hidden shadow-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* BONK Logo */}
          <Link href="/" className="flex items-center gap-2 group relative">
            <div className="text-3xl md:text-4xl bonk-shadow text-black font-black transform -rotate-1 group-hover:rotate-1 transition-transform duration-300">
              🐕 BONKIFY 🐕
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="bonk-button text-sm px-4 py-2 transform -rotate-1 hover:rotate-1"
            >
              🚀 BONKIFY
            </Link>
            <Link
              href="/gallery"
              className="bonk-button text-sm px-4 py-2 transform rotate-1 hover:-rotate-1"
            >
              🖼️ GALLERY
            </Link>
            <a
              href="https://x.com/i/communities/1939804671582818551"
              target="_blank"
              rel="noopener noreferrer"
              className="bonk-button text-sm px-4 py-2 transform rotate-2 hover:-rotate-2"
              aria-label="Follow us on X (Twitter)"
            >
              🐦 TWITTER
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bonk-button text-sm px-3 py-2 transform rotate-2 hover:-rotate-2"
            onClick={onMenuClick}
          >
            📱 MENU
          </button>
        </div>
      </div>
    </header>
  );
}