import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Floating emoji decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl opacity-30 float" style={{animationDelay: '0s'}}>🎨</div>
        <div className="absolute top-40 right-16 text-3xl opacity-40 float" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute top-60 left-1/4 text-5xl opacity-20 float" style={{animationDelay: '2s'}}>😊</div>
        <div className="absolute bottom-40 right-1/4 text-4xl opacity-35 float" style={{animationDelay: '0.5s'}}>🚀</div>
        <div className="absolute bottom-60 left-16 text-3xl opacity-25 float" style={{animationDelay: '1.5s'}}>🎉</div>
        <div className="absolute top-1/2 right-10 text-6xl opacity-15 float" style={{animationDelay: '3s'}}>💫</div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Hero content */}
        <div className="max-w-5xl mx-auto">
          {/* Fun emoji intro */}
          <div className="flex justify-center gap-4 mb-8">
            <span className="text-6xl bouncy" style={{animationDelay: '0s'}}>😄</span>
            <span className="text-6xl bouncy" style={{animationDelay: '0.2s'}}>📸</span>
            <span className="text-6xl bouncy" style={{animationDelay: '0.4s'}}>➡️</span>
            <span className="text-6xl bouncy" style={{animationDelay: '0.6s'}}>😎</span>
          </div>

          {/* Main title */}
          <h1 className="text-7xl md:text-9xl font-display gradient-text mb-8 tracking-tight text-bounce">
            emojify
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-4xl text-foreground mb-4 font-display font-semibold">
            turn your photos into fun emojis! 🎭
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 font-body max-w-3xl mx-auto">
            upload any image and watch our ai transform it into a cute, expressive emoji that captures the essence of your photo ✨
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button
              onClick={scrollToGenerator}
              className="btn-primary text-xl px-12 py-6 font-display font-bold rounded-full hover:bouncy"
            >
              🎨 Start Creating!
            </Button>
            <Button
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
              variant="outline"
              className="glass border-2 border-primary text-foreground text-xl px-12 py-6 font-display font-bold rounded-full hover:bg-primary/10"
            >
              🖼️ View Gallery
            </Button>
          </div>

          {/* Fun stats or features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 glass rounded-3xl hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-display font-bold text-lg mb-2">super fast</h3>
              <p className="text-muted-foreground font-body">ai magic in seconds</p>
            </div>
            <div className="text-center p-6 glass rounded-3xl hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-display font-bold text-lg mb-2">perfect quality</h3>
              <p className="text-muted-foreground font-body">high-res emoji output</p>
            </div>
            <div className="text-center p-6 glass rounded-3xl hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">💖</div>
              <h3 className="font-display font-bold text-lg mb-2">totally free</h3>
              <p className="text-muted-foreground font-body">no limits, no signup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-pink-300/10 to-yellow-300/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-300/10 to-purple-300/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-orange-300/5 to-red-300/5 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </section>
  );
}
