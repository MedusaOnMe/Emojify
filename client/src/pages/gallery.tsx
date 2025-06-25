import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { getAllImagesFromFirebase, onStorageChange } from "@/lib/firebase";
import { downloadImage } from "@/lib/image-utils";

interface Image {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  displayTitle?: string;
}

export default function Gallery() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-yellow-50">
      <Header onMenuClick={() => setIsMobileNavOpen(true)} />
      
      <main className="flex-1 pt-20 pb-10 relative">
        {/* Pokemon-themed gallery background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-8 h-8 md:w-12 md:h-12 opacity-15 transform rotate-90 bg-red-500 rounded-lg border-2 border-white" style={{ animation: 'paperShake 4s ease-in-out infinite', animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-40 left-5 w-6 h-6 md:w-10 md:h-10 opacity-20 transform -rotate-45 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ animation: 'crumple 2.5s ease-in-out infinite', animationDelay: '0.8s' }}>⚡</div>
          <div className="absolute top-1/2 right-5 w-5 h-5 md:w-8 md:h-8 opacity-10 transform rotate-180 bg-yellow-500 rounded-full" style={{ animation: 'sway 3s ease-in-out infinite', animationDelay: '2s' }}></div>
          <div className="absolute top-32 left-8 w-6 h-6 md:w-10 md:h-10 opacity-18 transform rotate-45 bg-green-500 rounded-lg" style={{ animation: 'float 3.8s ease-in-out infinite', animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-4 h-4 md:w-6 md:h-6 opacity-25 transform -rotate-30 bg-purple-500 rounded-full" style={{ animation: 'wiggle 2.2s ease-in-out infinite', animationDelay: '1.8s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-3 h-3 md:w-5 md:h-5 opacity-8 transform rotate-135 bg-orange-500 rounded-lg" style={{ animation: 'bounce 5s infinite', animationDelay: '3.2s' }}></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent transform -rotate-1">
              POKEDEX
            </h1>
            <Link href="/" className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-4 py-2 transition-all flex items-center gap-2 border-2 border-yellow-400 transform rotate-1 hover:rotate-0 hover:scale-105 rounded-lg font-bold">
              <span>+</span>
              POKEIFY
            </Link>
          </div>
          
          {error ? (
            <Card className="glass border-red-500/20">
              <CardContent className="p-6 text-center">
                <p>Error loading images. Please try again later.</p>
                <p className="text-xs text-red-400 mt-2">{error.message}</p>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass">
                  <div className="h-56 bg-primary-700/30 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-primary-700/30 animate-pulse rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-primary-700/30 animate-pulse rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image: Image) => (
                <Card key={image.id} className="glass overflow-hidden group relative">
                  <img 
                    src={image.url} 
                    alt={image.prompt.slice(0, 50)} 
                    className="w-full h-56 object-cover"
                  />
                  <CardContent className="p-4">
                    <p className="font-medium line-clamp-2 text-sm">{image.displayTitle || image.prompt}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(image.timestamp).toLocaleString()}
                      </span>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => downloadImage(image.url, `memex-${image.id.split('/').pop() || 'image'}`)}
                          className="p-1.5 rounded-lg bg-primary-700 hover:bg-primary-600 transition-colors"
                        >
                          <i className="ri-download-line text-sm"></i>
                        </button>
                        <button className="p-1.5 rounded-lg bg-primary-700 hover:bg-primary-600 transition-colors">
                          <i className="ri-share-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border-4 border-blue-400 shadow-lg">
              <div className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-blue-500 flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400">
                  <span className="text-3xl text-white">📋</span>
                </div>
                <h3 className="font-display text-xl mb-2 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Empty Pokedex</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Upload an image to create Pokemon cards.
                </p>
                <Link href="/" className="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-medium border-2 border-yellow-400 transform -rotate-1 hover:rotate-0 transition-all hover:scale-105 rounded-lg">
                  POKEIFY NOW
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      
      <MobileNavDrawer 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </div>
  );
}
