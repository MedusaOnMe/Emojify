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

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Hero content */}
        <div className="max-w-4xl mx-auto">

          {/* Main title with proper height to prevent clipping */}
          <div className="mb-6" style={{lineHeight: '1.6', paddingBottom: '1em', paddingTop: '0.5em', overflow: 'visible', minHeight: '150px'}}>
            <h1 className="text-6xl md:text-8xl font-display gradient-text tracking-tight" style={{overflow: 'visible', lineHeight: '1.4', paddingBottom: '0.3em'}}>
              Gorbify
            </h1>
          </div>

        </div>
      </div>

    </section>
  );
}
