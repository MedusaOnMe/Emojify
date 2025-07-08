import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { div, divContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { downloadImage } from "@/lib/image-utils";
import { uploadImageToFirebase, onStorageChange } from "@/lib/firebase";
import { toast } from "sonner";

// Interface for image data
interface ImageData {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export default function ImageGenerator() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Set up real-time listener for the latest images
  useEffect(() => {
    const unsubscribe = onStorageChange((images) => {
      if (images && images.length > 0) {
        const latestImage = images[0];
        setCurrentImage(latestImage);
        setIsUpdating(false);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Cleanup function for when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  
  // Single image to emoji processing mutation
  const processMutation = useMutation({
    mutationFn: async () => {
      setIsUpdating(true);
      
      if (!imageFile) {
        throw new Error("Image is required");
      }
      
      const formData = new FormData();
      formData.append("image", imageFile);
      
      // Random BONK elements picker
      const bonkElements = [
        'Explosive Energy', 'Lightning Power', 'Fiery Blast', 'Thunder Strike', 'Mega Impact', 
        'Solar Flare', 'Cosmic Boom', 'Electric Surge', 'Burning Force', 'Atomic Burst',
        'Plasma Wave', 'Neon Glow', 'Laser Beam', 'Rocket Fuel'
      ];
      const randomElement = bonkElements[Math.floor(Math.random() * bonkElements.length)];
      
      // Create BONK transformation prompt that references both images
      const hardcodedPrompt = `Replace the center character with the uploaded subject in the same 3D cartoon style. Keep everything else identical - background, exclamation marks, lighting.`;
      
      formData.append("prompt", hardcodedPrompt);
      
      const response = await fetch("/api/images/bonkify", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to process images");
      }
      
      return response.json();
    },
    onSuccess: async (data) => {
      if (data?.url) {
        try {
          const imageResponse = await fetch(data.url);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch processed image: ${imageResponse.statusText}`);
          }
          
          const imageBlob = await imageResponse.blob();
          const stableUrl = URL.createObjectURL(imageBlob);
          
          try {
            await uploadImageToFirebase(stableUrl, "Bonkify Creation");
          } finally {
            URL.revokeObjectURL(stableUrl);
          }
        } catch (error) {
          console.error("Failed to upload image to Firebase:", error);
          setIsUpdating(false);
        }
      }
    },
    onError: (error) => {
      setIsUpdating(false);
      toast.error(error instanceof Error ? error.message : "Failed to process images");
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("No image selected");
      return;
    }
    
    
    setIsUpdating(true);
    processMutation.reset();
    processMutation.mutate();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type");
        return;
      }
      
      const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSizeInBytes) {
        toast.error("File too large");
        return;
      }
      
      try {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          toast.error("Invalid image file");
        };
        
        img.onload = () => {
          setImageFile(file);
          setImagePreview(objectUrl);
        };
        
        img.src = objectUrl;
      } catch (error) {
        toast.error("Error processing image");
      }
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type");
        return;
      }
      
      const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSizeInBytes) {
        toast.error("File too large");
        return;
      }
      
      try {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          toast.error("Invalid image file");
        };
        
        img.onload = () => {
          setImageFile(file);
          setImagePreview(objectUrl);
        };
        
        img.src = objectUrl;
      } catch (error) {
        toast.error("Error processing image");
      }
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
    <section id="image-generator" className="py-16 relative animated-bg">
      {/* Floating BONK Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-8 floating-bonk" style={{ animationDelay: '0s' }}>BONK</div>
        <div className="absolute top-32 right-12 floating-bonk" style={{ animationDelay: '1s' }}>BONK</div>
        <div className="absolute bottom-24 left-16 floating-bonk" style={{ animationDelay: '2s' }}>BONK</div>
        <div className="absolute bottom-40 right-8 floating-bonk" style={{ animationDelay: '1.5s' }}>BONK</div>
      </div>

      <div className="container px-6 mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl bonk-text mb-4">
            BONK ZONE
          </h2>
          <p className="text-2xl md:text-3xl neon-text font-black">
            UPLOAD YOUR PIC AND GET BONKED!
          </p>
          <div className="mt-4">
            <span className="retro-border bg-yellow-400 px-6 py-3 text-black font-black text-xl transform -rotate-1 inline-block">
              MAXIMUM BONK ENERGY
            </span>
          </div>
        </div>
        
        {/* Split Layout - Upload and Result Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload */}
          <div className="bonk-card bg-yellow-400 transform rotate-1">
            <div className="text-center mb-8">
              <h3 className="text-3xl bonk-shadow text-black font-black mb-2">UPLOAD ZONE</h3>
              <div className="w-16 h-1 bg-black mx-auto"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div 
                className={`relative p-8 text-center transition-all duration-300 border-4 border-dashed border-black ${
                  dragActive 
                    ? 'bg-orange-400 scale-105 transform rotate-2' 
                    : imagePreview 
                      ? 'bg-orange-200' 
                      : 'bg-orange-100 hover:bg-orange-200'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="retro-border bg-white p-2">
                        <img 
                          src={imagePreview} 
                          alt="Image to transform" 
                          className="max-h-64 mx-auto"
                        />
                      </div>
                      <button 
                        type="button"
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 font-bold border-2 border-black"
                        onClick={() => {
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview);
                          }
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="text-6xl mb-4 bonk-shadow text-black">+</div>
                    </div>
                    <h4 className="text-2xl bonk-shadow text-black font-black mb-3">DRAG YOUR IMAGE HERE!</h4>
                    <p className="text-lg text-black font-bold mb-6">or click the button below</p>
                    
                    <button 
                      type="button" 
                      className="bonk-button text-xl transform rotate-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      CHOOSE FILE
                    </button>
                  </>
                )}
                <input 
                  ref={fileInputRef}
                  id="upload-image" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              {/* Transform Button */}
              {imagePreview && (
                <div className="flex justify-center">
                  <button 
                    type="submit" 
                    className="bonk-button text-3xl transform -rotate-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processMutation.isPending || !imageFile}
                  >
                    {processMutation.isPending ? (
                      "BONKING..."
                    ) : (
                      "BONKIFY NOW!"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
          
          {/* Right Side - Result */}
          <div className="bonk-card bg-orange-400 transform -rotate-1">
            <div className="text-center mb-8">
              <h3 className="text-3xl bonk-shadow text-black font-black mb-2">BONKED RESULT</h3>
              <div className="w-16 h-1 bg-black mx-auto"></div>
            </div>
            
            <div className="min-h-[400px] flex items-center justify-center">
              {processMutation.isPending || isUpdating ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 bonk-shadow text-black">~</div>
                  <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h4 className="text-2xl bonk-shadow text-black font-black mb-4">BONKING IN PROGRESS...</h4>
                  <p className="text-lg rainbow-text font-black">MAXIMUM BONK ENERGY LOADING!</p>
                </div>
              ) : processMutation.isError ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 bonk-shadow text-black">X</div>
                  <h4 className="text-2xl bonk-shadow text-black font-black mb-4">BONK FAILED!</h4>
                  <p className="text-lg text-black font-bold mb-6">
                    {processMutation.error instanceof Error ? processMutation.error.message : "Try again!"}
                  </p>
                  <button 
                    onClick={() => processMutation.reset()}
                    className="bonk-button"
                  >
                    TRY AGAIN
                  </button>
                </div>
              ) : processMutation.data ? (
                <div className="text-center py-4 w-full">
                  <div className="flex justify-center items-center h-full">
                    <div className="retro-border bg-white p-4 transform rotate-2">
                      <img 
                        src={processMutation.data?.url} 
                        alt="BONK Style Portrait"
                        className="w-full max-w-xs mx-auto"
                        style={{ aspectRatio: '1/1' }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-xl glitch-text font-black mb-4">BONK SUCCESSFUL!</p>
                    <button 
                      className="bonk-button text-xl transform rotate-1"
                      onClick={async () => {
                        try {
                          const imageUrl = processMutation.data?.url;
                          const imageId = processMutation.data?.id || 'bonkify';
                          
                          if (!imageUrl) {
                            toast.error("Download failed");
                            return;
                          }
                          
                          await downloadImage(imageUrl, `bonkify-${imageId}`);
                          
                          toast.success("Download complete");
                        } catch (error) {
                          toast.error("Download failed");
                        }
                      }}
                    >
                      DOWNLOAD BONK
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 bonk-shadow text-black">?</div>
                  <h4 className="text-2xl bonk-shadow text-black font-black mb-4">READY TO BONK!</h4>
                  <p className="text-lg rainbow-text font-black max-w-sm mx-auto">
                    UPLOAD AN IMAGE TO GET MAXIMUM BONK POWER!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Meme Text */}
        <div className="text-center mt-16">
          <p className="text-3xl neon-text font-black">
            BONK TO THE MOON!
          </p>
          <p className="text-xl glitch-text font-black mt-4">
            SUCH WOW • VERY BONK • MUCH TRANSFORM
          </p>
        </div>
      </div>
    </section>
  );
}