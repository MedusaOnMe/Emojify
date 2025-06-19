import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [showOscar, setShowOscar] = useState(false);

  useEffect(() => {
    // Start Oscar animation after component mounts
    const timer = setTimeout(() => {
      setShowOscar(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToGenerator = () => {
    const element = document.getElementById("image-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gray-200">
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Oscar Animation Container */}
          <div className="relative mb-8 flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              {/* Oscar with Lid - Animates up from behind - BEHIND trash can */}
              <img 
                src="/images/oscar-with-lid.png" 
                alt=""
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto z-10 transition-all duration-1000 ease-out ${
                  showOscar ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
              />
              
              {/* Trash Can Base - IN FRONT to cover Oscar initially */}
              <img 
                src="/images/trash-can.png" 
                alt=""
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto z-20"
              />
            </div>
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
