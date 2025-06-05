import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
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
        <div className="max-w-4xl mx-auto">
          {/* Fun emoji intro */}
          <div className="flex justify-center gap-4 mb-6">
            <span className="text-5xl bouncy" style={{animationDelay: '0s'}}>😄</span>
            <span className="text-5xl bouncy" style={{animationDelay: '0.2s'}}>📸</span>
            <span className="text-5xl bouncy" style={{animationDelay: '0.4s'}}>➡️</span>
            <span className="text-5xl bouncy" style={{animationDelay: '0.6s'}}>😎</span>
          </div>

          {/* Main title with proper height to prevent clipping */}
          <div className="mb-6" style={{lineHeight: '1.1', paddingBottom: '0.2em'}}>
            <h1 className="text-6xl md:text-8xl font-display gradient-text tracking-tight text-bounce">
              emojify
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground mb-6 font-body font-semibold max-w-2xl mx-auto">
            upload any image and watch our ai transform it into a cute, expressive emoji that captures the essence of your photo ✨
          </p>
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
