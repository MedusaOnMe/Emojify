import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t-4 border-green-600 py-12 mt-16 relative transform rotate-1">
      {/* Pokemon-themed footer elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-5 left-10 w-6 h-6 md:w-10 md:h-10 opacity-15 transform rotate-45 bg-red-500 rounded-full" style={{ animation: 'paperShake 4s ease-in-out infinite', animationDelay: '0s' }}></div>
        <div className="absolute bottom-5 right-20 w-5 h-5 md:w-8 md:h-8 opacity-20 transform -rotate-30 bg-blue-500 rounded-lg" style={{ animation: 'sway 3s ease-in-out infinite', animationDelay: '1s' }}></div>
        <div className="absolute top-8 right-1/3 w-4 h-4 md:w-6 md:h-6 opacity-18 transform rotate-90 bg-yellow-500 rounded-full" style={{ animation: 'crumple 5s ease-in-out infinite', animationDelay: '2s' }}></div>
        <div className="absolute bottom-8 left-1/4 w-5 h-5 md:w-8 md:h-8 opacity-12 transform -rotate-45 bg-green-500 rounded-lg" style={{ animation: 'float 2.5s ease-in-out infinite', animationDelay: '1.5s' }}></div>
      </div>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z"/>
                </svg>
              </div>
              <div>
                <span className="font-display text-2xl font-bold gradient-text">
                  Pokeify
                </span>
              </div>
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-foreground hover:text-green-600 transition-colors font-display font-semibold text-lg transform -rotate-1 hover:rotate-0 hover:scale-105"
            >
              POKEIFY
            </Link>
            <Link 
              href="/gallery" 
              className="text-foreground hover:text-green-600 transition-colors font-display font-semibold text-lg transform rotate-1 hover:rotate-0 hover:scale-105"
            >
              GALLERY
            </Link>
          </div>
        </div>
        
        <div className="w-full h-1 bg-green-600 my-8 transform -rotate-1"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-foreground text-base font-body font-semibold transform rotate-1">
              © {currentYear} POKEIFY - BECOME A POKEMON
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}