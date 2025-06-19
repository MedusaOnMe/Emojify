import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
      
      // Hardcoded prompt for putting subject in Oscar's trash bin
      const hardcodedPrompt = "Place this character inside a realistic, full-sized metal garbage can with the lid balanced on top of their head like a hat. The character should be positioned sitting inside the can with their head, shoulders and upper torso visible above the rim. Show the complete trash can from bottom to top - it should be a large, cylindrical galvanized steel garbage can with vertical ridges, weathered surface with realistic rust spots and dents. The metal lid sits directly on the character's head. The character maintains their exact original appearance, colors, and pixelated style. Photorealistic trash can with natural lighting and simple background";
      
      formData.append("prompt", hardcodedPrompt);
      
      const response = await fetch("/api/images/gorbify", {
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
            await uploadImageToFirebase(stableUrl, "Gorbify Creation");
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
    <section id="image-generator" className="py-8 relative">
      <div className="container px-6 mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display text-green-800">
            Gorbify
          </h2>
        </div>
        
        {/* Split Layout - Upload and Result Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload */}
          <Card className="modern-card border-4 border-green-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display text-green-800 mb-2">Upload</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div 
                  className={`border-4 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-green-600 bg-green-100 scale-105' 
                      : imagePreview 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Image to transform" 
                        className="max-h-64 mx-auto rounded-2xl shadow-xl border-2 border-green-200"
                      />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110 font-bold shadow-lg"
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
                  ) : (
                    <>
                      <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-display text-gray-800 font-semibold mb-3">Upload Image</h4>
                      <p className="text-gray-600 mb-6 font-body">PNG, JPG, etc.</p>
                      <button 
                        type="button" 
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full hover:scale-105 transition-all font-display font-bold shadow-lg"
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
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xl font-display font-bold py-6 px-12 rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
                      disabled={processMutation.isPending || !imageFile}
                    >
                      {processMutation.isPending ? (
                        <span className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z"/>
                          </svg>
                          Gorbify
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          {/* Right Side - Result */}
          <Card className="modern-card border-4 border-green-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display text-green-800 mb-2">Result</h3>
              </div>
              
              <div className="min-h-[400px] flex items-center justify-center">
                {processMutation.isPending || isUpdating ? (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <svg className="w-16 h-16 mx-auto text-green-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z"/>
                      </svg>
                    </div>
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h4 className="text-xl font-display text-green-800 mb-4">Processing...</h4>
                  </div>
                ) : processMutation.isError ? (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <svg className="w-16 h-16 mx-auto text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-display text-red-500 mb-4">Error</h4>
                    <p className="text-gray-600 font-body mb-6">
                      {processMutation.error instanceof Error ? processMutation.error.message : "Please try again"}
                    </p>
                    <button 
                      onClick={() => processMutation.reset()}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full font-display font-bold hover:scale-105 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                ) : processMutation.data ? (
                  <div className="text-center py-12 w-full">
                    <div className="flex justify-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-display text-green-800 mb-6">Complete</h3>
                    
                    <div className="inline-block rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-green-50 to-gray-50 shadow-xl border-2 border-green-200 mb-6">
                      <img 
                        src={processMutation.data?.url} 
                        alt="Gorbify Creation"
                        className="max-w-full max-h-64 rounded-xl shadow-lg"
                      />
                    </div>
                    
                    <button 
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full hover:scale-105 transition-all text-lg font-display font-bold shadow-xl"
                      onClick={async () => {
                        try {
                          const imageUrl = processMutation.data?.url;
                          const imageId = processMutation.data?.id || 'emoji';
                          
                          if (!imageUrl) {
                            toast.error("Download failed");
                            return;
                          }
                          
                          await downloadImage(imageUrl, `gorbify-${imageId}`);
                          
                          toast.success("Download complete");
                        } catch (error) {
                          toast.error("Download failed");
                        }
                      }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                      </svg>
                      Download
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <svg className="w-16 h-16 mx-auto text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6Z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-display text-green-800 mb-4">Ready</h4>
                    <p className="text-gray-600 font-body max-w-sm mx-auto">
                      Upload an image to gorbify
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}