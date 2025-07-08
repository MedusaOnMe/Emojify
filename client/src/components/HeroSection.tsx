import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-500 rounded-full opacity-30" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-orange-400 rounded-full opacity-40" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-orange-600 rounded-full opacity-20" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Main BONK Logo */}
          <div className="relative mb-12 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-8 py-6 bg-black rounded-xl leading-none flex items-center">
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  BONK
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-12 text-center">
            <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tight">
              BONKIFY
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              AI-Powered Image Transformation
            </p>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Upload any image and transform it with explosive BONK energy using advanced AI technology
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToGenerator}
            className="relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black shadow-xl"
          >
            <span className="relative">START TRANSFORMING</span>
          </button>

        </div>
      </div>
    </section>
  );
}
