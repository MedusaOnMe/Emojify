import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gray-200">
      {/* Pokemon-themed floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Pokemon card elements */}
        <div className="absolute top-10 left-10 w-14 h-14 md:w-20 md:h-20 opacity-30 transform rotate-12 bg-red-500 rounded-lg border-2 border-white" style={{ animation: 'crumple 4s ease-in-out infinite', animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-16 w-10 h-10 md:w-16 md:h-16 opacity-25 transform -rotate-6 bg-blue-500 rounded-lg border-2 border-white" style={{ animation: 'sway 3s ease-in-out infinite', animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-18 h-18 md:w-24 md:h-24 opacity-20 transform rotate-45 bg-yellow-500 rounded-lg border-2 border-white" style={{ animation: 'wiggle 2s ease-in-out infinite', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-5 w-16 h-16 md:w-20 md:h-20 opacity-25 transform -rotate-45 bg-green-500 rounded-lg border-2 border-white" style={{ animation: 'float 2.5s ease-in-out infinite', animationDelay: '1.5s' }}></div>
        
        {/* Pokemon symbols */}
        <div className="absolute top-1/3 left-5 w-12 h-12 md:w-16 md:h-16 opacity-20 transform rotate-90 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-lg font-bold" style={{ animation: 'bounce 3.5s infinite', animationDelay: '2.5s' }}>⚡</div>
        <div className="absolute bottom-32 right-20 w-8 h-8 md:w-12 md:h-12 opacity-35 transform -rotate-12 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold" style={{ animation: 'sway 4s ease-in-out infinite', animationDelay: '0.8s' }}>🔥</div>
        <div className="absolute top-1/4 left-1/3 w-6 h-6 md:w-10 md:h-10 opacity-15 transform rotate-135 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1.8s' }}>💧</div>
        <div className="absolute bottom-1/3 right-1/4 w-10 h-10 md:w-16 md:h-16 opacity-25 transform -rotate-30 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold" style={{ animation: 'crumple 2.8s ease-in-out infinite', animationDelay: '0.3s' }}>🌿</div>
        
        {/* Extra Pokemon elements */}
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 md:w-12 md:h-12 opacity-30 transform rotate-180 bg-pink-500 rounded-lg border-2 border-white" style={{ animation: 'bounce 4s infinite', animationDelay: '3s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-14 h-14 md:w-18 md:h-18 opacity-20 transform rotate-60 bg-indigo-500 rounded-lg border-2 border-white" style={{ animation: 'wiggle 1.8s ease-in-out infinite', animationDelay: '0.7s' }}></div>
        <div className="absolute top-40 left-1/2 w-5 h-5 md:w-8 md:h-8 opacity-25 transform -rotate-90 bg-teal-500 rounded-full" style={{ animation: 'sway 3.2s ease-in-out infinite', animationDelay: '2.2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-6 h-6 md:w-10 md:h-10 opacity-18 transform rotate-45 bg-rose-500 rounded-full" style={{ animation: 'float 2.3s ease-in-out infinite', animationDelay: '1.1s' }}></div>
        
        {/* Extra scattered elements */}
        <div className="absolute top-2/3 left-8 w-5 h-5 md:w-7 md:h-7 opacity-12 transform rotate-270 bg-amber-500 rounded-lg" style={{ animation: 'crumple 5s ease-in-out infinite', animationDelay: '4s' }}></div>
        <div className="absolute top-16 right-1/4 w-4 h-4 md:w-6 md:h-6 opacity-8 transform rotate-15 bg-violet-500 rounded-full" style={{ animation: 'bounce 6s infinite', animationDelay: '5s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Pokemon Card */}
          <div className="relative mb-8 flex justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-110 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl border-4 border-yellow-400 shadow-2xl flex items-center justify-center">
              <div className="text-white text-6xl md:text-8xl">⚡</div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-6xl md:text-8xl font-display gradient-text tracking-tight transform -rotate-1">
              POKEIFY
            </h1>
            <p className="text-sm md:text-lg text-green-800 font-bold font-display transform -rotate-2 mt-2">
              CA: SOON
            </p>
            <p className="text-lg md:text-xl text-gray-700 mt-4 font-body transform rotate-1">
              Transform into a Pokemon card
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToGenerator}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 text-xl transform -rotate-1 hover:rotate-0 transition-all duration-200 border-2 border-gray-800 shadow-lg"
          >
            GET POKEIFIED
          </button>

        </div>
      </div>
    </section>
  );
}
