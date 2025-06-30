import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-yellow-500">
      {/* Floating Chinese Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl md:text-8xl text-yellow-400 opacity-70 font-bold" style={{ animation: 'floatSpin 8s ease-in-out infinite', animationDelay: '0s' }}>
          ★
        </div>
        <div className="absolute top-20 right-16 text-4xl md:text-6xl text-yellow-400 opacity-60 font-bold" style={{ animation: 'swayScale 6s ease-in-out infinite', animationDelay: '1s' }}>
          中
        </div>
        <div className="absolute bottom-20 left-1/4 text-5xl md:text-7xl text-yellow-400 opacity-50 font-bold" style={{ animation: 'bounceSpin 7s ease-in-out infinite', animationDelay: '2s' }}>
          华
        </div>
        <div className="absolute top-1/2 right-5 text-4xl md:text-6xl text-yellow-400 opacity-65 font-bold" style={{ animation: 'wiggleFloat 5s ease-in-out infinite', animationDelay: '1.5s' }}>
          ☭
        </div>
        <div className="absolute bottom-32 right-20 text-3xl md:text-5xl text-yellow-400 opacity-45 font-bold" style={{ animation: 'orbit 10s linear infinite', animationDelay: '0.8s' }}>
          ★
        </div>
        <div className="absolute top-1/4 left-1/3 text-2xl md:text-4xl text-yellow-400 opacity-35 font-bold" style={{ animation: 'floatSpin 12s ease-in-out infinite reverse', animationDelay: '1.8s' }}>
          人
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl md:text-6xl text-yellow-400 opacity-55 font-bold" style={{ animation: 'swayScale 4s ease-in-out infinite', animationDelay: '0.3s' }}>
          民
        </div>
        <div className="absolute top-2/3 left-8 text-2xl md:text-4xl text-yellow-400 opacity-40 font-bold" style={{ animation: 'bounceSpin 6s ease-in-out infinite reverse', animationDelay: '4s' }}>
          ★
        </div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Main China Card */}
          <div className="relative mb-8 flex justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-110 bg-gradient-to-br from-red-600 to-yellow-500 rounded-xl border-4 border-yellow-400 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-8xl md:text-9xl text-yellow-400 font-bold flex flex-col items-center">
                <div>中</div>
                <div className="text-6xl md:text-7xl">华</div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <img 
              src="/title.png" 
              alt="Chinaify"
              className="mx-auto mb-4 max-w-md md:max-w-2xl w-full h-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            />
            <p className="text-sm md:text-lg text-yellow-300 font-bold font-display transform -rotate-2 mt-2 drop-shadow-lg">
              光荣的中华人民共和国 GLORIOUS PRC
            </p>
            <p className="text-lg md:text-xl text-yellow-100 mt-4 font-body transform rotate-1 drop-shadow-lg">
              变成中华风格同志 Transform into Chinese Comrade Style
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToGenerator}
            className="bg-gradient-to-r from-red-700 to-yellow-500 hover:from-red-800 hover:to-yellow-600 text-white font-bold py-4 px-8 text-xl transform -rotate-1 hover:rotate-0 transition-all duration-200 border-2 border-yellow-400 shadow-lg rounded-lg"
          >
            开始中华化 GET CHINAIFIED!
          </button>

        </div>
      </div>
    </section>
  );
}
