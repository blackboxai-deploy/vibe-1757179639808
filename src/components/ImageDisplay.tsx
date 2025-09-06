"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageDisplayProps {
  currentImage: string | null;
  isGenerating: boolean;
  progress: number;
  error: string | null;
}

export function ImageDisplay({ currentImage, isGenerating, progress, error }: ImageDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = async () => {
    if (!currentImage) return;

    setDownloadLoading(true);
    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `3d-samosa-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleShare = async () => {
    if (!currentImage) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '3D Samosa Scene',
          text: 'Check out this amazing 3D samosa scene I generated!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg h-fit">
      <CardContent className="p-6">
        <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 rounded-lg overflow-hidden relative">
          {/* Loading State */}
          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    🍽️
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">Crafting your 3D samosa scene...</p>
                  <p className="text-sm text-gray-500">This may take 30-60 seconds</p>
                  <div className="w-64 mx-auto">
                    <Progress value={progress} className="h-2 bg-orange-100" />
                    <p className="text-xs text-center text-gray-500 mt-1">{Math.round(progress)}% complete</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Generated Image */}
          {currentImage && !isGenerating && (
            <>
              <img
                src={currentImage}
                alt="Generated 3D samosa scene"
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
                </div>
              )}
            </>
          )}

          {/* Default State */}
          {!currentImage && !isGenerating && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🥟</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Generate</h3>
              <p className="text-gray-500 max-w-sm">
                Customize your scene settings and click generate to create a hyper-realistic 3D samosa image
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {currentImage && !isGenerating && (
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleDownload}
              disabled={downloadLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {downloadLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </div>
              ) : (
                "⬇️ Download Image"
              )}
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              📤 Share
            </Button>
          </div>
        )}

        {/* Image Info */}
        {currentImage && !isGenerating && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800 mb-1">Generated Scene Details:</p>
              <p>• Hyper-realistic 3D rendering with professional lighting</p>
              <p>• Authentic Indian samosa with golden-brown texture</p>
              <p>• Complementary sauce and traditional presentation</p>
              <p className="mt-2 text-xs text-gray-500">
                High-resolution image suitable for commercial use
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}