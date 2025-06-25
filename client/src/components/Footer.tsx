import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-red-400 via-blue-400 to-yellow-400 border-t-4 border-yellow-400 py-12 mt-16 relative transform rotate-1">
      {/* Floating Pokemon Images in Footer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="/one.png" alt="" className="absolute top-5 left-10 w-6 h-6 md:w-10 md:h-10 opacity-50" style={{ animation: 'orbit 15s linear infinite', animationDelay: '0s' }} />
        <img src="/two.png" alt="" className="absolute bottom-5 right-20 w-5 h-5 md:w-8 md:h-8 opacity-45" style={{ animation: 'swayScale 5s ease-in-out infinite', animationDelay: '1s' }} />
        <img src="/three.png" alt="" className="absolute top-8 right-1/3 w-4 h-4 md:w-6 md:h-6 opacity-40" style={{ animation: 'wiggleFloat 6s ease-in-out infinite', animationDelay: '2s' }} />
        <img src="/four.png" alt="" className="absolute bottom-8 left-1/4 w-5 h-5 md:w-8 md:h-8 opacity-55" style={{ animation: 'floatSpin 8s ease-in-out infinite reverse', animationDelay: '1.5s' }} />
      </div>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-yellow-300">
                <span className="text-white text-xl">⚡</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                  Pokeify
                </span>
              </div>
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-white hover:text-yellow-200 transition-colors font-display font-semibold text-lg transform -rotate-1 hover:rotate-0 hover:scale-105"
            >
              POKEIFY
            </Link>
            <Link 
              href="/gallery" 
              className="text-white hover:text-yellow-200 transition-colors font-display font-semibold text-lg transform rotate-1 hover:rotate-0 hover:scale-105"
            >
              POKEDEX
            </Link>
          </div>
        </div>
        
        <div className="w-full h-1 bg-yellow-300 my-8 transform -rotate-1"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-white text-base font-body font-semibold transform rotate-1">
              © {currentYear} POKEIFY - BECOME A POKEMON
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}