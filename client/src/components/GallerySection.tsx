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
          <div className="mb-8" style={{lineHeight: '1.2', paddingBottom: '0.5em', paddingTop: '0.2em', overflow: 'visible'}}>
            <h2 className="text-5xl md:text-7xl font-display gradient-text" style={{overflow: 'visible'}}>
              Gallery
            </h2>
          </div>
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
            <h3 className="text-2xl font-display text-red-500 mb-4">Error loading gallery</h3>
            <p className="text-muted-foreground font-body">
              {error ? error.message : "Something went wrong"}
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
                    alt="Pokeify creation" 
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300"
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
            <h3 className="text-3xl font-display gradient-text mb-4">
              No images
            </h3>
            <p className="text-muted-foreground font-body text-lg mb-8">
              Upload an image to create Pokemon cards
            </p>
            <Button 
              className="bg-green-600 text-white px-8 py-4 rounded-full font-display font-bold"
              onClick={() => document.getElementById('image-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Pokeify
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
                  alt="Pokeify creation" 
                  className="w-full object-contain rounded-3xl shadow-2xl"
                />
              </div>
              
              <div className="p-8 text-center">
                <h3 className="text-3xl font-display gradient-text mb-4">
                  Pokeify Creation
                </h3>
                <p className="text-muted-foreground font-body mb-8">
                  Created: {new Date(selectedImage.timestamp).toLocaleDateString()}
                </p>
                
                <Button 
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-display font-bold"
                  onClick={() => downloadImage(selectedImage.url, `gorbify-${selectedImage.id.split('/').pop() || 'creation'}`)}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </section>
  );
}