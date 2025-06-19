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
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-20 bg-green-600/20 rounded-lg rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-16 w-12 h-15 bg-gray-500/30 rounded-lg -rotate-12 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 right-1/4 w-14 h-18 bg-green-700/25 rounded-lg rotate-45 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-60 left-16 w-10 h-12 bg-gray-600/20 rounded-lg -rotate-45 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Hero content */}
        <div className="max-w-4xl mx-auto">
          {/* Hero intro */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H4L6 19V21H18V19L20 9H21Z"/>
              </svg>
            </div>
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,6H10L8.5,5L7.5,4L8.5,3L10,2H14L15.5,3L16.5,4L15.5,5L14,6M7,8V16L8,17H16L17,16V8L16,7H8L7,8Z"/>
              </svg>
            </div>
            <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z"/>
              </svg>
            </div>
          </div>

          {/* Main title with proper height to prevent clipping */}
          <div className="mb-6" style={{lineHeight: '1.6', paddingBottom: '1em', paddingTop: '0.5em', overflow: 'visible', minHeight: '150px'}}>
            <h1 className="text-6xl md:text-8xl font-display gradient-text tracking-tight text-bounce" style={{overflow: 'visible', lineHeight: '1.4', paddingBottom: '0.3em'}}>
              Gorbify
            </h1>
          </div>

        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-green-300/10 to-gray-400/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-green-600/10 to-gray-600/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-green-400/5 to-gray-500/5 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </section>
  );
}
