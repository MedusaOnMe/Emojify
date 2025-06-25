import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-red-100 via-blue-100 to-yellow-100">
      {/* Floating Pokemon Images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/one.png" 
          alt=""
          className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24 opacity-70" 
          style={{ animation: 'floatSpin 8s ease-in-out infinite', animationDelay: '0s' }}
        />
        <img 
          src="/two.png" 
          alt=""
          className="absolute top-20 right-16 w-12 h-12 md:w-20 md:h-20 opacity-60" 
          style={{ animation: 'swayScale 6s ease-in-out infinite', animationDelay: '1s' }}
        />
        <img 
          src="/three.png" 
          alt=""
          className="absolute bottom-20 left-1/4 w-20 h-20 md:w-28 md:h-28 opacity-50" 
          style={{ animation: 'bounceSpin 7s ease-in-out infinite', animationDelay: '2s' }}
        />
        <img 
          src="/four.png" 
          alt=""
          className="absolute top-1/2 right-5 w-18 h-18 md:w-24 md:h-24 opacity-65" 
          style={{ animation: 'wiggleFloat 5s ease-in-out infinite', animationDelay: '1.5s' }}
        />
        <img 
          src="/one.png" 
          alt=""
          className="absolute bottom-32 right-20 w-10 h-10 md:w-16 md:h-16 opacity-45" 
          style={{ animation: 'orbit 10s linear infinite', animationDelay: '0.8s' }}
        />
        <img 
          src="/two.png" 
          alt=""
          className="absolute top-1/4 left-1/3 w-8 h-8 md:w-14 md:h-14 opacity-35" 
          style={{ animation: 'floatSpin 12s ease-in-out infinite reverse', animationDelay: '1.8s' }}
        />
        <img 
          src="/three.png" 
          alt=""
          className="absolute bottom-1/3 right-1/4 w-14 h-14 md:w-22 md:h-22 opacity-55" 
          style={{ animation: 'swayScale 4s ease-in-out infinite', animationDelay: '0.3s' }}
        />
        <img 
          src="/four.png" 
          alt=""
          className="absolute top-2/3 left-8 w-8 h-8 md:w-12 md:h-12 opacity-40" 
          style={{ animation: 'bounceSpin 6s ease-in-out infinite reverse', animationDelay: '4s' }}
        />
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
            <img 
              src="/title.png" 
              alt="Pokeify"
              className="mx-auto mb-4 max-w-md md:max-w-2xl w-full h-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300"
            />
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
            className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-bold py-4 px-8 text-xl transform -rotate-1 hover:rotate-0 transition-all duration-200 border-2 border-yellow-400 shadow-lg rounded-lg"
          >
            GET POKEIFIED
          </button>

        </div>
      </div>
    </section>
  );
}
