import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { downloadImage } from "@/lib/image-utils";
import { uploadImageToFirebase, onStorageChange } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

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
      
      // Hardcoded prompt for converting image to emoji
      const hardcodedPrompt = "Convert this image into a cute, simple emoji style. Make it round, colorful, and expressive like a standard emoji. Remove any complex details and focus on the main subject with bold, clear features that would work well as a small emoji icon.";
      
      formData.append("prompt", hardcodedPrompt);
      
      const response = await fetch("/api/images/emojify", {
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
            await uploadImageToFirebase(stableUrl, "emojify Creation");
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process images",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast({
        title: "Missing Image",
        description: "Please upload an image before creating your emoji",
        variant: "destructive"
      });
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
        toast({
          title: "Invalid file type",
          description: `File type ${file.type} is not a supported image format`,
          variant: "destructive"
        });
        return;
      }
      
      const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSizeInBytes) {
        toast({
          title: "File too large",
          description: `Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 4MB.`,
          variant: "destructive"
        });
        return;
      }
      
      try {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          toast({
            title: "Invalid image",
            description: "Unable to load image. The file may be corrupted or not a valid image.",
            variant: "destructive"
          });
        };
        
        img.onload = () => {
          setImageFile(file);
          setImagePreview(objectUrl);
        };
        
        img.src = objectUrl;
      } catch (error) {
        toast({
          title: "Error processing image",
          description: "An error occurred while processing the image file.",
          variant: "destructive"
        });
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
        toast({
          title: "Invalid file type",
          description: `File type ${file.type} is not a supported image format`,
          variant: "destructive"
        });
        return;
      }
      
      const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSizeInBytes) {
        toast({
          title: "File too large",
          description: `Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 4MB.`,
          variant: "destructive"
        });
        return;
      }
      
      try {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          toast({
            title: "Invalid image",
            description: "Unable to load image. The file may be corrupted or not a valid image.",
            variant: "destructive"
          });
        };
        
        img.onload = () => {
          setImageFile(file);
          setImagePreview(objectUrl);
        };
        
        img.src = objectUrl;
      } catch (error) {
        toast({
          title: "Error processing image",
          description: "An error occurred while processing the dropped image file.",
          variant: "destructive"
        });
      }
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
    <section id="image-generator" className="py-8 relative">
      <div className="container px-6 mx-auto max-w-5xl">
        {/* Streamlined Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <span className="text-4xl bouncy" style={{animationDelay: '0s'}}>🎨</span>
            <span className="text-4xl bouncy" style={{animationDelay: '0.3s'}}>✨</span>
            <span className="text-4xl bouncy" style={{animationDelay: '0.6s'}}>🎭</span>
          </div>
          <div className="mb-4" style={{lineHeight: '1.1', paddingBottom: '0.15em'}}>
            <h2 className="text-3xl md:text-5xl font-display gradient-text">
              transform your photos!
            </h2>
          </div>
        </div>
        
        {/* Split Layout - Upload and Result Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload */}
          <Card className="modern-card border-4 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display gradient-text mb-2">Upload Image</h3>
                <p className="text-foreground font-body">Choose a photo to transform</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div 
                  className={`border-4 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : imagePreview 
                        ? 'border-green-400 bg-green-400/10' 
                        : 'border-border hover:border-primary hover:bg-primary/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Image to emojify" 
                        className="max-h-64 mx-auto rounded-2xl shadow-xl border-2 border-primary/20"
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
                      <div className="text-6xl mb-4 bouncy">📸</div>
                      <h4 className="text-lg font-display text-foreground font-semibold mb-3">Upload or Drag Image</h4>
                      <p className="text-muted-foreground mb-6 font-body">PNG, JPG, or other image formats</p>
                      <button 
                        type="button" 
                        className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:scale-105 transition-all font-display font-bold shadow-lg"
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
                      className="emoji-gradient text-white text-xl font-display font-bold py-6 px-12 rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
                      disabled={processMutation.isPending || !imageFile}
                    >
                      {processMutation.isPending ? (
                        <span className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          🎭 Transform!
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          {/* Right Side - Result */}
          <Card className="modern-card border-4 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display gradient-text mb-2">Your Result</h3>
                <p className="text-foreground font-body">Your emoji will appear here</p>
              </div>
              
              <div className="min-h-[400px] flex items-center justify-center">
                {processMutation.isPending || isUpdating ? (
                  <div className="text-center py-12">
                    <div className="text-7xl mb-6 bouncy">🎨</div>
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h4 className="text-xl font-display gradient-text mb-4">Creating your emoji...</h4>
                    <p className="text-foreground font-body">This may take a moment</p>
                  </div>
                ) : processMutation.isError ? (
                  <div className="text-center py-12">
                    <div className="text-7xl mb-6 wiggle">😵</div>
                    <h4 className="text-xl font-display text-red-500 mb-4">Something went wrong</h4>
                    <p className="text-foreground font-body mb-6">
                      {processMutation.error instanceof Error ? processMutation.error.message : "Please try again"}
                    </p>
                    <button 
                      onClick={() => processMutation.reset()}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-display font-bold hover:scale-105 transition-all"
                    >
                      🔄 Try Again
                    </button>
                  </div>
                ) : processMutation.data ? (
                  <div className="text-center py-12 w-full">
                    <div className="flex justify-center gap-3 mb-6">
                      <span className="text-5xl bouncy" style={{animationDelay: '0s'}}>🎉</span>
                      <span className="text-5xl bouncy" style={{animationDelay: '0.2s'}}>✨</span>
                      <span className="text-5xl bouncy" style={{animationDelay: '0.4s'}}>😍</span>
                    </div>
                    <h3 className="text-2xl font-display gradient-text mb-6">Perfect! Here's your emoji</h3>
                    
                    <div className="inline-block rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20 mb-6">
                      <img 
                        src={processMutation.data?.url} 
                        alt="emojify Creation"
                        className="max-w-full max-h-64 rounded-xl shadow-lg"
                      />
                    </div>
                    
                    <button 
                      className="success-gradient text-white px-8 py-4 rounded-full hover:scale-105 transition-all text-lg font-display font-bold shadow-xl"
                      onClick={async () => {
                        try {
                          const imageUrl = processMutation.data?.url;
                          const imageId = processMutation.data?.id || 'emoji';
                          
                          if (!imageUrl) {
                            toast({
                              title: "Download failed",
                              description: "No image URL available for download",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          await downloadImage(imageUrl, `emoji-${imageId}`);
                          
                          toast({
                            title: "Download successful! 🎉",
                            description: "Your amazing emoji has been saved!"
                          });
                        } catch (error) {
                          toast({
                            title: "Download failed 😞",
                            description: error instanceof Error ? error.message : "Failed to download image",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      💾 Download Emoji
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-7xl mb-6 bouncy">🎭</div>
                    <h4 className="text-xl font-display gradient-text mb-4">Ready for magic?</h4>
                    <p className="text-foreground font-body max-w-sm mx-auto">
                      Upload an image on the left to see your emoji appear here! 
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