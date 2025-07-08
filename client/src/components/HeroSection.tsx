import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden animated-bg">
      {/* Floating BONK Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 floating-bonk" style={{ animationDelay: '0s' }}>
          BONK
        </div>
        <div className="absolute top-20 right-16 floating-bonk" style={{ animationDelay: '1s', fontSize: '1.5rem' }}>
          BONK
        </div>
        <div className="absolute bottom-20 left-1/4 floating-bonk" style={{ animationDelay: '2s', fontSize: '2.5rem' }}>
          BONK
        </div>
        <div className="absolute top-1/2 right-5 floating-bonk" style={{ animationDelay: '1.5s', fontSize: '1.2rem' }}>
          BONK
        </div>
        <div className="absolute bottom-32 right-20 floating-bonk" style={{ animationDelay: '0.8s', fontSize: '1.8rem' }}>
          BONK
        </div>
        <div className="absolute top-1/4 left-1/3 floating-bonk" style={{ animationDelay: '1.8s', fontSize: '1rem' }}>
          BONK
        </div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Main BONK Logo */}
          <div className="relative mb-12 flex justify-center">
            <div className="bonk-card bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 transform rotate-2">
              <div className="text-6xl md:text-8xl bonk-shadow text-black">
                🐕 BONK 🐕
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-12">
            <h1 className="text-8xl md:text-9xl bonk-text mb-6 font-black">
              BONKIFY
            </h1>
            <p className="text-2xl md:text-3xl neon-text mb-4 font-black">
              THE ULTIMATE MEME MACHINE
            </p>
            <p className="text-xl md:text-2xl rainbow-text font-black">
              TRANSFORM YOUR PICS WITH BONK POWER!
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToGenerator}
            className="bonk-button text-2xl md:text-3xl transform rotate-1 hover:rotate-2"
          >
            🚀 GET BONKED NOW! 🚀
          </button>

          {/* Meme Text */}
          <div className="mt-8">
            <p className="text-lg glitch-text font-black">
              MUCH WOW • VERY BONK • SUCH TRANSFORM
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}