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
      {/* ABSOLUTE CHAOS - ALL 3 IMAGE TYPES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* OSCARS */}
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24 opacity-30 transform rotate-12"
          style={{ animation: 'crumple 4s ease-in-out infinite', animationDelay: '0s' }}
        />
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute top-20 right-16 w-12 h-12 md:w-20 md:h-20 opacity-25 transform -rotate-6"
          style={{ animation: 'sway 3s ease-in-out infinite', animationDelay: '1s' }}
        />
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute bottom-20 left-1/4 w-20 h-20 md:w-28 md:h-28 opacity-20 transform rotate-45"
          style={{ animation: 'wiggle 2s ease-in-out infinite', animationDelay: '2s' }}
        />
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute top-1/2 right-5 w-18 h-18 md:w-24 md:h-24 opacity-25 transform -rotate-45"
          style={{ animation: 'float 2.5s ease-in-out infinite', animationDelay: '1.5s' }}
        />
        
        {/* TRASH CANS */}
        <img 
          src="/images/trash-can.png" 
          alt=""
          className="absolute top-1/3 left-5 w-14 h-14 md:w-18 md:h-18 opacity-20 transform rotate-90"
          style={{ animation: 'bounce 3.5s infinite', animationDelay: '2.5s' }}
        />
        <img 
          src="/images/trash-can.png" 
          alt=""
          className="absolute bottom-32 right-20 w-10 h-10 md:w-16 md:h-16 opacity-35 transform -rotate-12"
          style={{ animation: 'sway 4s ease-in-out infinite', animationDelay: '0.8s' }}
        />
        <img 
          src="/images/trash-can.png" 
          alt=""
          className="absolute top-1/4 left-1/3 w-8 h-8 md:w-12 md:h-12 opacity-15 transform rotate-135"
          style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1.8s' }}
        />
        <img 
          src="/images/trash-can.png" 
          alt=""
          className="absolute bottom-1/3 right-1/4 w-12 h-12 md:w-20 md:h-20 opacity-25 transform -rotate-30"
          style={{ animation: 'crumple 2.8s ease-in-out infinite', animationDelay: '0.3s' }}
        />
        
        {/* GORBS */}
        <img 
          src="/images/gorb.png" 
          alt=""
          className="absolute bottom-1/4 left-1/3 w-10 h-10 md:w-14 md:h-14 opacity-30 transform rotate-180"
          style={{ animation: 'bounce 4s infinite', animationDelay: '3s' }}
        />
        <img 
          src="/images/gorb.png" 
          alt=""
          className="absolute top-1/4 right-1/3 w-16 h-16 md:w-22 md:h-22 opacity-20 transform rotate-60"
          style={{ animation: 'wiggle 1.8s ease-in-out infinite', animationDelay: '0.7s' }}
        />
        <img 
          src="/images/gorb.png" 
          alt=""
          className="absolute top-40 left-1/2 w-6 h-6 md:w-10 md:h-10 opacity-25 transform -rotate-90"
          style={{ animation: 'sway 3.2s ease-in-out infinite', animationDelay: '2.2s' }}
        />
        <img 
          src="/images/gorb.png" 
          alt=""
          className="absolute bottom-40 right-1/3 w-8 h-8 md:w-12 md:h-12 opacity-18 transform rotate-45"
          style={{ animation: 'float 2.3s ease-in-out infinite', animationDelay: '1.1s' }}
        />
        
        {/* EXTRA SCATTERED CHAOS */}
        <img 
          src="/images/oscar-with-lid.png" 
          alt=""
          className="absolute top-2/3 left-8 w-6 h-6 md:w-8 md:h-8 opacity-12 transform rotate-270"
          style={{ animation: 'crumple 5s ease-in-out infinite', animationDelay: '4s' }}
        />
        <img 
          src="/images/trash-can.png" 
          alt=""
          className="absolute top-16 right-1/4 w-5 h-5 md:w-8 md:h-8 opacity-8 transform rotate-15"
          style={{ animation: 'bounce 6s infinite', animationDelay: '5s' }}
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
            <p className="text-sm md:text-lg text-green-800 font-bold font-display transform -rotate-2 mt-2">
              CA: SOON
            </p>
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
