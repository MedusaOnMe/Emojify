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
      {/* Floating Oscar Images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24 opacity-30 transform rotate-12 animate-bounce"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        />
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute top-20 right-16 w-12 h-12 md:w-20 md:h-20 opacity-25 transform -rotate-6"
          style={{ 
            animation: 'float 4s ease-in-out infinite',
            animationDelay: '1s'
          }}
        />
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute bottom-20 left-1/4 w-20 h-20 md:w-28 md:h-28 opacity-20 transform rotate-45"
          style={{ 
            animation: 'wiggle 2s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute bottom-32 right-20 w-14 h-14 md:w-22 md:h-22 opacity-35 transform -rotate-12"
          style={{ 
            animation: 'bounce 2.5s infinite',
            animationDelay: '0.5s'
          }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Oscar */}
          <div className="relative mb-8 flex justify-center">
            <img 
              src="/images/oscar-with-lid.png" 
              alt=""
              className="w-48 h-48 md:w-64 md:h-64 transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-110"
            />
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-6xl md:text-8xl font-display gradient-text tracking-tight transform -rotate-1">
              GORBIFY
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mt-4 font-body transform rotate-1">
              Throw yourself in the trash
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToGenerator}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 text-xl transform -rotate-1 hover:rotate-0 transition-all duration-200 border-2 border-gray-800 shadow-lg"
          >
            GET GORBIFIED
          </button>

        </div>
      </div>
    </section>
  );
}
