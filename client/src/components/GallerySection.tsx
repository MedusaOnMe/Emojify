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
    <section id="gallery" className="py-20 relative bg-gradient-to-br from-red-600 via-red-700 to-yellow-500">
      <div className="container px-6 mx-auto relative z-10 max-w-6xl">
        {/* Gallery Header */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <img 
              src="/pokedex.png" 
              alt="Chinaify Gallery"
              className="mx-auto max-w-md md:max-w-2xl w-full h-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(15)].map((_, index) => (
              <div key={index} className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 rounded-lg opacity-60"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-xl">
                  <div className="aspect-[1/1] relative">
                    <Skeleton className="w-full h-full" style={{background: '#e5e7eb'}} />
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded">
                      <Skeleton className="h-3 w-8" style={{background: '#d1d5db'}} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center p-12 max-w-lg mx-auto bg-white rounded-xl border-4 border-red-400 shadow-lg">
            <h3 className="text-2xl font-display text-red-500 mb-4">Error loading Gallery</h3>
            <p className="text-muted-foreground font-body">
              {error ? error.message : "Something went wrong"}
            </p>
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {images.map((image: Image, index) => (
              <div 
                key={image.id} 
                className="relative cursor-pointer hover:scale-105 transition-all duration-300 group"
                onClick={() => handleImageClick(image)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* China Card with holographic border */
                <div className="relative">
                  {/* Holographic outer glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 rounded-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-xl">
                    {/* China card image */
                    <div className="aspect-[1/1] relative">
                      <img 
                        src={image.url} 
                        alt={`China Card #${String(index + 1).padStart(3, '0')}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy" 
                      />
                      
                      {/* Card number overlay */
                      <div className="absolute top-2 left-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm font-bold">
                        #{String(images.length - index).padStart(3, '0')}
                      </div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-16 max-w-lg mx-auto bg-white rounded-xl border-4 border-blue-400 shadow-lg">
            <h3 className="text-3xl font-display bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-4">
              空的中华图片库 Empty Gallery
            </h3>
            <p className="text-gray-600 font-body text-lg mb-8">
              上传图片创建你的第一个中华同志 Upload image to create your first Chinese Comrade!
            </p>
            <Button 
              className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-display font-bold border-2 border-yellow-400"
              onClick={() => document.getElementById('image-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              开始中华化 Start Chinaifying!
            </Button>
          </div>
        )}
      </div>
      
      {/* Image details modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{background: 'rgba(0,0,0,0.7)'}}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden border-4 border-yellow-400 shadow-2xl">
            <div className="relative">
              <button 
                className="absolute top-6 right-6 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center z-10 hover:bg-red-600 transition-all hover:scale-110 font-bold text-xl shadow-lg"
                onClick={closeDetails}
              >
                ×
              </button>
              
              <div className="overflow-hidden max-h-[70vh] bg-gradient-to-br from-blue-600 to-purple-700 p-8 flex items-center justify-center">
                <div className="relative">
                  {/* Holographic card frame */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 rounded-2xl opacity-80 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-1 rounded-xl">
                    <img 
                      src={selectedImage.url} 
                      alt={`China Card #${images.findIndex(img => img.id === selectedImage.id) + 1}`}
                      className="max-w-sm w-full object-contain rounded-lg shadow-2xl"
                      style={{ aspectRatio: '1/1' }}
                    />
                  </div>
                  {/* Sparkle effects */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              
              <div className="p-8 text-center">
                <h3 className="text-3xl font-display bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-4">
                  中华同志 Chinaify Card #{String(images.length - images.findIndex(img => img.id === selectedImage.id)).padStart(3, '0')}
                </h3>
                
                <Button 
                  className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-display font-bold border-2 border-yellow-400"
                  onClick={() => downloadImage(selectedImage.url, `chinaify-${selectedImage.id.split('/').pop() || 'creation'}`)}
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