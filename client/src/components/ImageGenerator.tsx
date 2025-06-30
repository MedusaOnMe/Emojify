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
      
      // Random Chinese elements picker
      const chineseElements = [
        '火 Fire', '水 Water', '木 Wood', '金 Metal', '土 Earth', 
        '雷 Thunder', '风 Wind', '山 Mountain', '龙 Dragon', '凤 Phoenix',
        '虎 Tiger', '熊猫 Panda', '长城 Great Wall', '功夫 Kung Fu'
      ];
      const randomElement = chineseElements[Math.floor(Math.random() * chineseElements.length)];
      
      // Create Chinese heritage transformation prompt
      const hardcodedPrompt = `Edit this photo to give the person East Asian eye shape while keeping their face, expression, background and everything else exactly the same. Add a traditional conical hat and Asian robes.`
      
      formData.append("prompt", hardcodedPrompt);
      
      const response = await fetch("/api/images/chinaify", {
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
            await uploadImageToFirebase(stableUrl, "Pokeify Creation");
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
    <section id="image-generator" className="py-8 relative bg-gradient-to-br from-red-600 via-red-700 to-yellow-500">
      {/* Floating Chinese Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Chinese Stars */}
        <div className="absolute top-10 right-10 w-12 h-12 text-yellow-400 opacity-70" style={{ animation: 'bounceSpin 6s ease-in-out infinite', animationDelay: '1s' }}>
          ★
        </div>
        <div className="absolute bottom-20 left-8 w-8 h-8 text-yellow-400 opacity-80" style={{ animation: 'wiggleFloat 4s ease-in-out infinite', animationDelay: '0.5s' }}>
          ★
        </div>
        <div className="absolute top-1/2 left-2 w-10 h-10 text-yellow-400 opacity-60" style={{ animation: 'floatSpin 8s ease-in-out infinite reverse', animationDelay: '2s' }}>
          ☭
        </div>
        <div className="absolute bottom-32 right-5 w-6 h-6 text-yellow-400 opacity-75" style={{ animation: 'swayScale 5s ease-in-out infinite', animationDelay: '1.3s' }}>
          ★
        </div>
        <div className="absolute top-20 left-1/4 w-8 h-8 text-yellow-400 opacity-65" style={{ animation: 'orbit 12s linear infinite', animationDelay: '2.8s' }}>
          ☭
        </div>
        {/* Chinese Characters */}
        <div className="absolute top-16 right-1/4 text-2xl text-yellow-400 opacity-40 font-bold" style={{ animation: 'floatSpin 10s ease-in-out infinite', animationDelay: '1.5s' }}>
          中华
        </div>
        <div className="absolute bottom-16 left-1/3 text-xl text-yellow-400 opacity-50 font-bold" style={{ animation: 'bounceSpin 8s ease-in-out infinite reverse', animationDelay: '2.5s' }}>
          人民
        </div>
        <div className="absolute top-1/3 right-8 text-lg text-yellow-400 opacity-45 font-bold" style={{ animation: 'wiggleFloat 6s ease-in-out infinite', animationDelay: '0.8s' }}>
          共和国
        </div>
      </div>
      <div className="container px-6 mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent transform -rotate-1">
            上传照片 CHINAIFY 同志!
          </h2>
        </div>
        
        {/* Split Layout - Upload and Result Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload */}
          <div className="relative border-4 border-yellow-400 rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700">
            {/* Chinese Pattern Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 border-4 border-white rounded-full"></div>
              <div className="absolute top-16 right-8 w-6 h-6 border-3 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-12 w-4 h-4 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-8 right-16 w-10 h-10 border-4 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-8 border-white rounded-full opacity-30"></div>
            </div>
            {/* Lightning Bolt Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="absolute top-6 right-12 w-12 h-12 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
              </svg>
              <svg className="absolute bottom-12 left-6 w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
              </svg>
            </div>
            <divContent className="p-8 relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display text-white mb-2 transform rotate-1 drop-shadow-lg">UPLOAD IMAGE</h3>
                <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div 
                  className={`rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'bg-yellow-400/20 scale-105' 
                      : imagePreview 
                        ? 'bg-white/10' 
                        : 'bg-white/5 hover:bg-white/15'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-1 rounded-2xl shadow-2xl">
                          <img 
                            src={imagePreview} 
                            alt="Image to transform" 
                            className="max-h-64 mx-auto rounded-xl shadow-xl"
                          />
                        </div>
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
                      
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9,2V7.5L5.5,4L4,5.5L7.5,9H2V11H7.5L4,14.5L5.5,16L9,12.5V18H11V12.5L14.5,16L16,14.5L12.5,11H18V9H12.5L16,5.5L14.5,4L11,7.5V2H9Z"/>
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-lg font-display text-white font-semibold mb-3 drop-shadow-lg">DRAG OR CLICK</h4>
                      <p className="text-white/80 mb-6 font-body">Any image file</p>
                      
                      <button 
                        type="button" 
                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 px-8 py-3 font-display font-bold shadow-lg border-2 border-white transform -rotate-1 hover:rotate-0 transition-all hover:animate-pulse rounded-lg"
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={(e) => {
                          if (e.currentTarget) {
                            e.currentTarget.style.animation = 'shake 0.5s ease-in-out';
                            setTimeout(() => {
                              if (e.currentTarget) {
                                e.currentTarget.style.animation = '';
                              }
                            }, 500);
                          }
                        }}
                      >
                        选择文件 PICK FILE
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
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 text-xl font-display font-bold py-6 px-12 transition-all shadow-xl disabled:opacity-50 border-2 border-white transform rotate-1 hover:rotate-0 rounded-lg"
                      disabled={processMutation.isPending || !imageFile}
                      onMouseEnter={(e) => {
                        if (!processMutation.isPending && imageFile && e.currentTarget) {
                          e.currentTarget.style.animation = 'shake 0.6s ease-in-out';
                          setTimeout(() => {
                            if (e.currentTarget) {
                              e.currentTarget.style.animation = '';
                            }
                          }, 600);
                        }
                      }}
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
                          中华化 CHINAIFY!
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </divContent>
          </div>
          
          {/* Right Side - Result */}
          <div className="relative border-4 border-yellow-400 rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-yellow-600">
            {/* Chinese Flag Elements Background */}
            <div className="absolute inset-0 opacity-15">
              {/* Large star */}
              <svg className="absolute top-8 left-8 w-16 h-16 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L15.09,8.26L22,9L17,14L18.18,21L12,17.77L5.82,21L7,14L2,9L8.91,8.26L12,2Z"/>
              </svg>
              {/* Smaller stars */}
              <svg className="absolute top-6 left-28 w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L15.09,8.26L22,9L17,14L18.18,21L12,17.77L5.82,21L7,14L2,9L8.91,8.26L12,2Z"/>
              </svg>
              <svg className="absolute top-12 left-32 w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L15.09,8.26L22,9L17,14L18.18,21L12,17.77L5.82,21L7,14L2,9L8.91,8.26L12,2Z"/>
              </svg>
              <svg className="absolute top-20 left-28 w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L15.09,8.26L22,9L17,14L18.18,21L12,17.77L5.82,21L7,14L2,9L8.91,8.26L12,2Z"/>
              </svg>
              <svg className="absolute top-24 left-32 w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L15.09,8.26L22,9L17,14L18.18,21L12,17.77L5.82,21L7,14L2,9L8.91,8.26L12,2Z"/>
              </svg>
            </div>
            {/* Hammer and Sickle Pattern */}
            <div className="absolute inset-0 opacity-8">
              <div className="absolute bottom-16 right-8 text-2xl text-yellow-400 font-bold">
                ☭
              </div>
              <div className="absolute top-1/3 right-12 text-xl text-yellow-400 font-bold">
                ☭
              </div>
            </div>
            <divContent className="p-8 relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display text-white mb-2 transform -rotate-1 drop-shadow-lg">中华化完成! CHINAIFIED!</h3>
                <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>
              
              <div className="min-h-[400px] flex items-center justify-center">
                {processMutation.isPending || isUpdating ? (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h4 className="text-xl font-display text-white mb-4 drop-shadow-lg">正在创建光荣的中华同志... Creating Glorious Chinese Comrade!</h4>
                  </div>
                ) : processMutation.isError ? (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl font-display text-white mb-4 drop-shadow-lg">Error</h4>
                    <p className="text-white/80 font-body mb-6">
                      {processMutation.error instanceof Error ? processMutation.error.message : "Please try again"}
                    </p>
                    <button 
                      onClick={() => processMutation.reset()}
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 px-6 py-3 rounded-lg font-display font-bold hover:scale-105 transition-all border-2 border-white"
                    >
                      Try Again
                    </button>
                  </div>
                ) : processMutation.data ? (
                  <div className="text-center py-4 w-full">
                    <div className="flex justify-center items-center h-full">
                      <div className="relative">
                        {/* Holographic Card Frame */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl opacity-80 animate-pulse"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl opacity-60"></div>
                        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-1 rounded-xl">
                          <img 
                            src={processMutation.data?.url} 
                            alt="China Style Portrait"
                            className="w-full max-w-xs mx-auto rounded-lg shadow-2xl"
                            style={{ aspectRatio: '1/1' }}
                          />
                        </div>
                        {/* Sparkle Effects */}
                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                        <div className="absolute bottom-4 left-3 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-1/2 left-1 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                    
                    <button 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 px-8 py-4 transition-all text-lg font-display font-bold shadow-xl border-2 border-white transform -rotate-1 hover:rotate-0 rounded-lg mt-6 hover:scale-105"
                      onMouseEnter={(e) => {
                        if (e.currentTarget) {
                          e.currentTarget.style.animation = 'shake 0.4s ease-in-out';
                          setTimeout(() => {
                            if (e.currentTarget) {
                              e.currentTarget.style.animation = '';
                            }
                          }, 400);
                        }
                      }}
                      onClick={async () => {
                        try {
                          const imageUrl = processMutation.data?.url;
                          const imageId = processMutation.data?.id || 'emoji';
                          
                          if (!imageUrl) {
                            toast.error("Download failed");
                            return;
                          }
                          
                          await downloadImage(imageUrl, `pokeify-${imageId}`);
                          
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
                      <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5,17L9.5,11L13,15.5L15.5,12.5L19,17M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6Z"/>
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl font-display text-white mb-4 drop-shadow-lg">同志准备就绪! Comrade Ready!</h4>
                    <p className="text-white/80 font-body max-w-sm mx-auto">
                      上传图片成为光荣的中华同志! Upload image to become glorious Chinese comrade!
                    </p>
                  </div>
                )}
              </div>
            </divContent>
          </div>
        </div>
      </div>
    </section>
  );
}