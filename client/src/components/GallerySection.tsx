import { useState, useEffect } from "react";
import { getAllImagesFromFirebase, onStorageChange } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadImage } from "@/lib/image-utils";

interface Image {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  displayTitle?: string;
}

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Set up real-time listener for Firebase Storage changes
  useEffect(() => {
    setIsLoading(true);
    
    // Initial load of images
    const loadImages = async () => {
      try {
        const initialImages = await getAllImagesFromFirebase();
        setImages(initialImages);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load initial images:", err);
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Unknown error loading images"));
        setIsLoading(false);
      }
    };
    
    loadImages();
    
    // Set up real-time listener
    const unsubscribe = onStorageChange((updatedImages) => {
      setImages(updatedImages);
      setIsLoading(false);
    });
    
    // Clean up listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Handle image click
  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };
  
  // Close the details modal
  const closeDetails = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 relative">
      <div className="container px-6 mx-auto relative z-10 max-w-6xl">
        {/* Gallery Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-4 mb-8">
            <span className="text-6xl bouncy" style={{animationDelay: '0s'}}>🎨</span>
            <span className="text-6xl bouncy" style={{animationDelay: '0.3s'}}>🖼️</span>
            <span className="text-6xl bouncy" style={{animationDelay: '0.6s'}}>✨</span>
          </div>
          <div className="mb-6" style={{lineHeight: '1.0', paddingBottom: '0.3em', paddingTop: '0.1em'}}>
            <h2 className="text-5xl md:text-7xl font-display gradient-text">
              emoji gallery!
            </h2>
          </div>
          <p className="text-xl text-gray-800 font-body max-w-2xl mx-auto">
            check out all the amazing emojis created by our community! 🤩
          </p>
        </div>
      
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="modern-card p-4 overflow-hidden">
                <Skeleton className="w-full aspect-square rounded-2xl" style={{background: 'hsl(var(--muted))'}} />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center p-12 max-w-lg mx-auto modern-card">
            <div className="text-8xl mb-6 wiggle">💔</div>
            <h3 className="text-2xl font-display text-red-500 mb-4">oops! gallery won't load</h3>
            <p className="text-muted-foreground font-body">
              {error ? error.message : "something went wrong loading the emojis"}
            </p>
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image: Image, index) => (
              <div 
                key={image.id} 
                className="modern-card p-4 overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group"
                onClick={() => handleImageClick(image)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-2">
                  <img 
                    src={image.url} 
                    alt="emojify creation" 
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                    loading="lazy" 
                  />
                </div>
                <div className="pt-3 text-center">
                  <p className="text-xs text-muted-foreground font-body">
                    {new Date(image.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-16 max-w-lg mx-auto modern-card">
            <div className="text-9xl mb-8 bouncy">🎭</div>
            <h3 className="text-3xl font-display gradient-text mb-4">
              no emojis yet!
            </h3>
            <p className="text-muted-foreground font-body text-lg mb-8">
              be the first to create an amazing emoji! 
            </p>
            <Button 
              className="emoji-gradient text-white px-8 py-4 rounded-full font-display font-bold hover:scale-105 transition-all"
              onClick={() => document.getElementById('image-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🎨 Create First Emoji!
            </Button>
          </div>
        )}
      </div>
      
      {/* Image details modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{background: 'rgba(0,0,0,0.7)'}}>
          <div className="modern-card max-w-2xl w-full max-h-[90vh] overflow-hidden border-4 border-primary/30">
            <div className="relative">
              <button 
                className="absolute top-6 right-6 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center z-10 hover:bg-red-600 transition-all hover:scale-110 font-bold text-xl shadow-lg"
                onClick={closeDetails}
              >
                ×
              </button>
              
              <div className="overflow-hidden max-h-[60vh] bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                <img 
                  src={selectedImage.url} 
                  alt="emojify creation" 
                  className="w-full object-contain rounded-3xl shadow-2xl"
                />
              </div>
              
              <div className="p-8 text-center">
                <div className="flex justify-center gap-3 mb-6">
                  <span className="text-4xl bouncy" style={{animationDelay: '0s'}}>🎉</span>
                  <span className="text-4xl bouncy" style={{animationDelay: '0.2s'}}>✨</span>
                  <span className="text-4xl bouncy" style={{animationDelay: '0.4s'}}>😍</span>
                </div>
                <h3 className="text-3xl font-display gradient-text mb-4">
                  amazing emoji!
                </h3>
                <p className="text-muted-foreground font-body mb-8">
                  Created: {new Date(selectedImage.timestamp).toLocaleDateString()}
                </p>
                
                <Button 
                  className="success-gradient text-white px-8 py-4 rounded-full font-display font-bold hover:scale-105 transition-all text-lg"
                  onClick={() => downloadImage(selectedImage.url, `emoji-${selectedImage.id.split('/').pop() || 'creation'}`)}
                >
                  💾 Download This Emoji!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-5xl opacity-20 float" style={{animationDelay: '0s'}}>🎨</div>
        <div className="absolute top-40 right-16 text-4xl opacity-25 float" style={{animationDelay: '1s'}}>😊</div>
        <div className="absolute bottom-40 left-1/4 text-6xl opacity-15 float" style={{animationDelay: '2s'}}>✨</div>
        <div className="absolute bottom-60 right-20 text-3xl opacity-30 float" style={{animationDelay: '1.5s'}}>🎭</div>
      </div>
    </section>
  );
}