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
    <section id="image-generator" className="py-16 relative">
      <div className="container px-6 mx-auto max-w-4xl">
        {/* Fun Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-3 mb-6">
            <span className="text-5xl bouncy" style={{animationDelay: '0s'}}>🎨</span>
            <span className="text-5xl bouncy" style={{animationDelay: '0.3s'}}>✨</span>
            <span className="text-5xl bouncy" style={{animationDelay: '0.6s'}}>😊</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display gradient-text mb-6 text-bounce">
            create your emoji!
          </h2>
          <p className="text-xl md:text-2xl text-foreground font-display font-semibold mb-4">
            ready to transform your photo? 🚀
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body">
            simply upload any image below and watch as our ai works its magic to turn it into an adorable, expressive emoji! 
          </p>
        </div>
        
        {/* Main Card */}
        <Card className="modern-card border-4 border-primary/20">
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Upload Section */}
              <div className="max-w-md mx-auto">
                <div className="space-y-3">
                  <Label htmlFor="upload-image" className="text-2xl font-display gradient-text text-center block mb-4">
                    📸 Upload Your Image
                  </Label>
                  
                  <div 
                    className={`border-4 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${
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
                          className="max-h-72 mx-auto rounded-2xl shadow-2xl border-4 border-white"
                        />
                        <button 
                          type="button"
                          className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110 font-bold text-lg"
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
                        <div className="text-8xl mb-6 bouncy">📸</div>
                        <h3 className="text-2xl font-display gradient-text mb-4">Drop your image here</h3>
                        <p className="text-muted-foreground mb-8 font-body text-lg">or click the button below to browse your files</p>
                        <button 
                          type="button" 
                          className="emoji-gradient text-white px-10 py-5 rounded-full hover:scale-105 transition-all text-xl font-display font-bold shadow-2xl hover:shadow-primary/50"
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
                </div>
              </div>
              
              {/* Emojify Button */}
              <Button 
                type="submit" 
                className="w-full max-w-lg mx-auto emoji-gradient text-white text-2xl font-display font-bold py-8 px-12 rounded-full hover:scale-105 transition-all shadow-2xl hover:shadow-primary/50 disabled:opacity-50 disabled:scale-100"
                disabled={processMutation.isPending || !imageFile}
              >
                {processMutation.isPending ? (
                  <span className="flex items-center gap-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ✨ Creating Your Emoji...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    🎭 Transform to Emoji!
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Result Display */}
        <div className="mt-12">
          <Card className="modern-card border-4 border-primary/20">
            <CardContent className="p-10">
              {processMutation.isPending || isUpdating ? (
                <div className="text-center py-20">
                  <div className="text-8xl mb-6 bouncy">🎨</div>
                  <div className="w-20 h-20 border-6 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h4 className="text-2xl font-display gradient-text mb-4">✨ Creating Your Emoji...</h4>
                  <p className="text-muted-foreground font-body text-lg">our ai is working its magic! this should only take a few seconds 🚀</p>
                </div>
              ) : processMutation.isError ? (
                <div className="text-center py-20">
                  <div className="text-8xl mb-6 wiggle">😵</div>
                  <h4 className="text-2xl font-display text-red-500 mb-4">Oops! Something went wrong 💔</h4>
                  <p className="text-muted-foreground font-body text-lg mb-6">
                    {processMutation.error instanceof Error ? processMutation.error.message : "don't worry, these things happen! try again in a moment"}
                  </p>
                  <button 
                    onClick={() => processMutation.reset()}
                    className="emoji-gradient text-white px-8 py-4 rounded-full font-display font-bold hover:scale-105 transition-all"
                  >
                    🔄 Try Again
                  </button>
                </div>
              ) : processMutation.data ? (
                <div className="text-center py-12">
                  <div className="flex justify-center gap-4 mb-8">
                    <span className="text-6xl bouncy" style={{animationDelay: '0s'}}>🎉</span>
                    <span className="text-6xl bouncy" style={{animationDelay: '0.2s'}}>✨</span>
                    <span className="text-6xl bouncy" style={{animationDelay: '0.4s'}}>😍</span>
                  </div>
                  <h3 className="text-3xl font-display gradient-text mb-6">Your Emoji is Ready!</h3>
                  
                  <div className="inline-block rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl border-4 border-white mb-8">
                    <img 
                      src={processMutation.data?.url} 
                      alt="emojify Creation"
                      className="max-w-full max-h-96 rounded-2xl shadow-xl"
                    />
                  </div>
                  
                  {/* Download Button */}
                  <div>
                    <button 
                      className="success-gradient text-white px-10 py-5 rounded-full hover:scale-105 transition-all text-xl font-display font-bold shadow-2xl hover:shadow-green-500/50"
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
                            description: "Your amazing emoji has been saved to your device!"
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
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="flex justify-center gap-3 mb-8">
                    <span className="text-7xl bouncy" style={{animationDelay: '0s'}}>🤗</span>
                    <span className="text-7xl bouncy" style={{animationDelay: '0.3s'}}>📷</span>
                    <span className="text-7xl bouncy" style={{animationDelay: '0.6s'}}>✨</span>
                  </div>
                  <h4 className="text-3xl font-display gradient-text mb-4">Ready to Create Magic?</h4>
                  <p className="text-muted-foreground max-w-2xl mx-auto font-body text-lg">
                    your emoji masterpiece will appear here once you upload an image above! 
                    we can't wait to see what you create 🎨
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}