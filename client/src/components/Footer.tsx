import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-red-600 via-red-700 to-yellow-500 border-t-4 border-yellow-400 py-12 mt-16 relative transform rotate-1">
      {/* Floating Chinese Elements in Footer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-5 left-10 text-2xl md:text-4xl text-yellow-400 opacity-70 font-bold" style={{ animation: 'orbit 15s linear infinite', animationDelay: '0s' }}>★</div>
        <div className="absolute bottom-5 right-20 text-xl md:text-3xl text-yellow-400 opacity-65 font-bold" style={{ animation: 'swayScale 5s ease-in-out infinite', animationDelay: '1s' }}>中</div>
        <div className="absolute top-8 right-1/3 text-lg md:text-2xl text-yellow-400 opacity-60 font-bold" style={{ animation: 'wiggleFloat 6s ease-in-out infinite', animationDelay: '2s' }}>华</div>
        <div className="absolute bottom-8 left-1/4 text-xl md:text-3xl text-yellow-400 opacity-75 font-bold" style={{ animation: 'floatSpin 8s ease-in-out infinite reverse', animationDelay: '1.5s' }}>☭</div>
      </div>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-yellow-500 rounded-full flex items-center justify-center border-2 border-yellow-300">
                <span className="text-white text-xl">★</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                  Chinaify
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
              中华化 CHINAIFY
            </Link>
            <Link 
              href="/gallery" 
              className="text-white hover:text-yellow-200 transition-colors font-display font-semibold text-lg transform rotate-1 hover:rotate-0 hover:scale-105"
            >
              图片库 GALLERY
            </Link>
          </div>
        </div>
        
        <div className="w-full h-1 bg-yellow-300 my-8 transform -rotate-1"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-white text-base font-body font-semibold transform rotate-1">
              © {currentYear} CHINAIFY - 成为中华同志 BECOME A CHINESE COMRADE
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}