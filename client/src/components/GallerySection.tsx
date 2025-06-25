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
    <section id="gallery" className="py-20 relative bg-gradient-to-br from-blue-50 via-red-50 to-yellow-50">
      <div className="container px-6 mx-auto relative z-10 max-w-6xl">
        {/* Pokedex Header */}
        <div className="text-center mb-16">
          <div className="mb-8" style={{lineHeight: '1.2', paddingBottom: '0.5em', paddingTop: '0.2em', overflow: 'visible'}}>
            <h2 className="text-5xl md:text-7xl font-display gradient-text" style={{overflow: 'visible'}}>
              Pokedex
            </h2>
          </div>
        </div>
      
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-gradient-to-br from-red-400 to-blue-500 p-1 rounded-xl shadow-lg border-2 border-yellow-400">
                <div className="bg-white rounded-lg p-2 m-1">
                  <Skeleton className="w-full aspect-square rounded-lg" style={{background: '#e5e7eb'}} />
                  <div className="pt-2 text-center bg-gray-100 rounded-b-lg mt-1 py-2">
                    <Skeleton className="h-3 w-8 mx-auto mb-1" style={{background: '#d1d5db'}} />
                    <Skeleton className="h-2 w-16 mx-auto" style={{background: '#d1d5db'}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center p-12 max-w-lg mx-auto bg-white rounded-xl border-4 border-red-400 shadow-lg">
            <h3 className="text-2xl font-display text-red-500 mb-4">Error loading Pokedex</h3>
            <p className="text-muted-foreground font-body">
              {error ? error.message : "Something went wrong"}
            </p>
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image: Image, index) => (
              <div 
                key={image.id} 
                className="bg-gradient-to-br from-red-400 to-blue-500 p-1 rounded-xl cursor-pointer hover:scale-105 transition-all duration-300 group shadow-lg border-2 border-yellow-400"
                onClick={() => handleImageClick(image)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="bg-white rounded-lg p-2 m-1">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-yellow-100 to-blue-100 p-2 border-2 border-gray-300">
                    <img 
                      src={image.url} 
                      alt="Pokeify creation" 
                      className="w-full h-full object-cover rounded-md transition-transform duration-300"
                      loading="lazy" 
                    />
                  </div>
                  <div className="pt-2 text-center bg-gray-100 rounded-b-lg mt-1 py-2">
                    <p className="text-xs font-bold text-gray-700">
                      #{String(index + 1).padStart(3, '0')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(image.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-16 max-w-lg mx-auto bg-white rounded-xl border-4 border-blue-400 shadow-lg">
            <h3 className="text-3xl font-display bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Empty Pokedex
            </h3>
            <p className="text-gray-600 font-body text-lg mb-8">
              Upload an image to create your first Pokemon card
            </p>
            <Button 
              className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-display font-bold border-2 border-yellow-400"
              onClick={() => document.getElementById('image-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Pokeifying
            </Button>
          </div>
        )}
      </div>
      
      {/* Image details modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{background: 'rgba(0,0,0,0.7)'}}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-4 border-yellow-400 shadow-2xl">
            <div className="relative">
              <button 
                className="absolute top-6 right-6 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center z-10 hover:bg-red-600 transition-all hover:scale-110 font-bold text-xl shadow-lg"
                onClick={closeDetails}
              >
                ×
              </button>
              
              <div className="overflow-hidden max-h-[60vh] bg-gradient-to-br from-yellow-100 to-blue-100 p-8">
                <img 
                  src={selectedImage.url} 
                  alt="Pokeify creation" 
                  className="w-full object-contain rounded-3xl shadow-2xl"
                />
              </div>
              
              <div className="p-8 text-center">
                <h3 className="text-3xl font-display bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-4">
                  Pokemon Card
                </h3>
                <p className="text-gray-600 font-body mb-8">
                  Created: {new Date(selectedImage.timestamp).toLocaleDateString()}
                </p>
                
                <Button 
                  className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-display font-bold border-2 border-yellow-400"
                  onClick={() => downloadImage(selectedImage.url, `pokeify-${selectedImage.id.split('/').pop() || 'creation'}`)}
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