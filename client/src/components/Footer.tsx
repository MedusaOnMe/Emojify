import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t-4 border-primary py-12 mt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 emoji-gradient rounded-full flex items-center justify-center emoji-shadow bouncy">
                <span className="text-2xl">😄</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold gradient-text">
                  emojify
                </span>
                <div className="text-sm text-muted-foreground font-body">turn photos into emojis</div>
              </div>
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-foreground hover:text-primary transition-colors font-display font-semibold text-lg hover:scale-105 transform"
            >
              Create
            </Link>
            <Link 
              href="/gallery" 
              className="text-foreground hover:text-primary transition-colors font-display font-semibold text-lg hover:scale-105 transform"
            >
              Gallery
            </Link>
          </div>
        </div>
        
        {/* Fun Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full my-8"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-foreground text-base font-body font-semibold">
              © {currentYear} emojify. spreading joy one emoji at a time! 🎉
            </p>
            <p className="text-muted-foreground text-sm mt-2 font-body">
              transform any image into a cute, expressive emoji with ai magic ✨
            </p>
          </div>
          
          {/* Fun emoji decoration */}
          <div className="flex gap-2 text-2xl">
            <span className="bouncy" style={{animationDelay: '0s'}}>😊</span>
            <span className="bouncy" style={{animationDelay: '0.2s'}}>🎨</span>
            <span className="bouncy" style={{animationDelay: '0.4s'}}>🚀</span>
          </div>
        </div>
      </div>
    </footer>
  );
}