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
      
      // Create BONK transformation prompt
      const hardcodedPrompt = `Transform this image with explosive energy and vibrant colors. Add dynamic lighting effects, energy bursts, and make it look absolutely incredible with high-impact visual effects while keeping the main subject intact.`;
      
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
    <section id="image-generator" className="py-16 relative bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container px-6 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            Transform Your Image
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload any image and watch as our AI transforms it with explosive BONK energy
          </p>
        </div>
        
        {/* Split Layout - Upload and Result Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Upload */}
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Upload Image</h3>
              <div className="w-12 h-0.5 bg-orange-500 mx-auto rounded-full"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div 
                className={`relative rounded-2xl p-8 text-center transition-all duration-300 border-2 border-dashed ${
                  dragActive 
                    ? 'border-orange-500 bg-orange-500/10 scale-105' 
                    : imagePreview 
                      ? 'border-gray-600 bg-gray-800/30' 
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                      <div className="relative bg-black p-2 rounded-xl">
                        <img 
                          src={imagePreview} 
                          alt="Image to transform" 
                          className="max-h-64 mx-auto rounded-lg"
                        />
                      </div>
                      <button 
                        type="button"
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 font-bold shadow-lg"
                        onClick={() => {
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview);
                          }
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-3">Drag and drop your image here</h4>
                    <p className="text-gray-400 mb-6">or click to browse files</p>
                    
                    <button 
                      type="button" 
                      className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
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
                  <Button 
                    type="submit" 
                    className="relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={processMutation.isPending || !imageFile}
                  >
                    {processMutation.isPending ? (
                      <span className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        BONKIFY!
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
          
          {/* Right Side - Result */}
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">BONKIFIED Result</h3>
              <div className="w-12 h-0.5 bg-orange-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="min-h-[400px] flex items-center justify-center">
              {processMutation.isPending || isUpdating ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h4 className="text-xl font-semibold text-white mb-4">Adding EXPLOSIVE BONK Energy...</h4>
                  <p className="text-gray-400">This may take a few moments</p>
                </div>
              ) : processMutation.isError ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center border-2 border-red-400 mb-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4">Processing Failed</h4>
                  <p className="text-gray-400 mb-6">
                    {processMutation.error instanceof Error ? processMutation.error.message : "Please try again"}
                  </p>
                  <button 
                    onClick={() => processMutation.reset()}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : processMutation.data ? (
                <div className="text-center py-4 w-full">
                  <div className="flex justify-center items-center h-full">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-black p-2 rounded-xl">
                        <img 
                          src={processMutation.data?.url} 
                          alt="BONK Style Portrait"
                          className="w-full max-w-xs mx-auto rounded-lg shadow-2xl"
                          style={{ aspectRatio: '1/1' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-8 inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-xl"
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
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                    </svg>
                    Download Image
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center border border-gray-600 mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4">Ready to Transform</h4>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Upload an image to get started with BONK transformation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}