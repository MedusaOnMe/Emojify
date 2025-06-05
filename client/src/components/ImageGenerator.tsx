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
    <section id="image-generator" className="py-20 relative">
      <div className="container px-6 mx-auto max-w-3xl">
        {/* Streamlined Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display gradient-text mb-8">
            emojify anything! 🎭
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            drop an image, get an emoji. it's that simple! ✨
          </p>
        </div>
        
        {/* Single Unified Card */}
        <Card className="modern-card border-4 border-primary/20 overflow-hidden">
          <CardContent className="p-0">
            {/* Upload Section */}
            <div className="p-12 border-b-4 border-primary/10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div 
                  className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : imagePreview 
                        ? 'border-green-400 bg-green-400/10' 
                        : 'border-border hover:border-primary hover:bg-primary/5 hover:scale-102'
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
                        className="max-h-80 mx-auto rounded-3xl shadow-2xl border-4 border-white"
                      />
                      <button 
                        type="button"
                        className="absolute top-4 right-4 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110 font-bold text-xl shadow-lg"
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
                      <div className="text-9xl mb-8 bouncy">📸</div>
                      <h3 className="text-3xl font-display gradient-text mb-6">drag & drop your image</h3>
                      <p className="text-muted-foreground mb-10 font-body text-xl">or click below to browse</p>
                      <button 
                        type="button" 
                        className="emoji-gradient text-white px-12 py-6 rounded-full hover:scale-105 transition-all text-2xl font-display font-bold shadow-2xl hover:shadow-primary/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        🖼️ Choose Image
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
                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="emoji-gradient text-white text-2xl font-display font-bold py-8 px-16 rounded-full hover:scale-105 transition-all shadow-2xl hover:shadow-primary/50 disabled:opacity-50 disabled:scale-100"
                      disabled={processMutation.isPending || !imageFile}
                    >
                      {processMutation.isPending ? (
                        <span className="flex items-center gap-4">
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          ✨ Creating Magic...
                        </span>
                      ) : (
                        <span className="flex items-center gap-4">
                          🎭 Transform to Emoji!
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </div>
            
            {/* Result Section */}
            <div className="p-12 min-h-[400px] flex items-center justify-center">
              {processMutation.isPending || isUpdating ? (
                <div className="text-center py-16">
                  <div className="text-9xl mb-8 bouncy">🎨</div>
                  <div className="w-24 h-24 border-6 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                  <h4 className="text-3xl font-display gradient-text mb-6">✨ creating your emoji...</h4>
                  <p className="text-muted-foreground font-body text-xl">ai magic in progress! 🚀</p>
                </div>
              ) : processMutation.isError ? (
                <div className="text-center py-16">
                  <div className="text-9xl mb-8 wiggle">😵</div>
                  <h4 className="text-3xl font-display text-red-500 mb-6">oops! something went wrong 💔</h4>
                  <p className="text-muted-foreground font-body text-xl mb-8">
                    {processMutation.error instanceof Error ? processMutation.error.message : "don't worry, try again!"}
                  </p>
                  <button 
                    onClick={() => processMutation.reset()}
                    className="emoji-gradient text-white px-10 py-5 rounded-full font-display font-bold hover:scale-105 transition-all text-xl"
                  >
                    🔄 Try Again
                  </button>
                </div>
              ) : processMutation.data ? (
                <div className="text-center py-16 w-full">
                  <div className="flex justify-center gap-4 mb-10">
                    <span className="text-7xl bouncy" style={{animationDelay: '0s'}}>🎉</span>
                    <span className="text-7xl bouncy" style={{animationDelay: '0.2s'}}>✨</span>
                    <span className="text-7xl bouncy" style={{animationDelay: '0.4s'}}>😍</span>
                  </div>
                  <h3 className="text-4xl font-display gradient-text mb-10">tada! your emoji is ready!</h3>
                  
                  <div className="inline-block rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl border-4 border-white mb-10">
                    <img 
                      src={processMutation.data?.url} 
                      alt="emojify Creation"
                      className="max-w-full max-h-80 rounded-3xl shadow-xl"
                    />
                  </div>
                  
                  <button 
                    className="success-gradient text-white px-12 py-6 rounded-full hover:scale-105 transition-all text-2xl font-display font-bold shadow-2xl hover:shadow-green-500/50"
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
                    💾 Download Your Emoji!
                  </button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-9xl mb-8 bouncy">🎭</div>
                  <h4 className="text-3xl font-display gradient-text mb-6">upload an image to get started!</h4>
                  <p className="text-muted-foreground font-body text-xl max-w-lg mx-auto">
                    your amazing emoji will appear here once you upload something above 📸
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}