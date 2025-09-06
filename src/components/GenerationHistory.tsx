"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeneratedImage } from "@/lib/types";

interface GenerationHistoryProps {
  images: GeneratedImage[];
  onImageSelect: (image: GeneratedImage) => void;
}

export function GenerationHistory({ images, onImageSelect }: GenerationHistoryProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const getSettingsDescription = (settings: GeneratedImage['settings']) => {
    return {
      lighting: settings.lighting.replace('-', ' '),
      background: settings.background.replace('-', ' '),
      sauce: settings.sauce.replace('-', ' '),
      plate: settings.plate.replace('-', ' '),
      angle: settings.angle.replace('-', ' ')
    };
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all generated images?')) {
      // This would be handled by parent component
      console.log('Clear history requested');
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
          📸 Generation History
        </CardTitle>
        {images.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            🗑️ Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🖼️</div>
            <p className="text-gray-500">No images generated yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Your generated samosa scenes will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
                onClick={() => onImageSelect(image)}
              >
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-orange-300 transition-all duration-200">
                  <img
                    src={image.url}
                    alt={`Generated samosa scene - ${formatTimestamp(image.timestamp)}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Hover Overlay */}
                  {hoveredImage === image.id && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-200">
                      <div className="text-center text-white p-4">
                        <div className="text-2xl mb-2">👁️</div>
                        <p className="text-sm font-medium">Click to view</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 font-medium">
                      {formatTimestamp(image.timestamp)}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      3D Scene
                    </Badge>
                  </div>

                  {/* Settings Preview */}
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(getSettingsDescription(image.settings)).slice(0, 3).map(([key, value]) => (
                      <Badge
                        key={key}
                        variant="outline"
                        className="text-xs border-orange-200 text-orange-600 capitalize"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {images.length > 0 && (
          <div className="mt-8 pt-6 border-t border-orange-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-orange-600">{images.length}</p>
                <p className="text-sm text-gray-600">Total Generated</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">
                  {images.filter(img => img.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-sm text-gray-600">Today</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(images.map(img => img.settings.lighting)).size}
                </p>
                <p className="text-sm text-gray-600">Lighting Styles</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(images.map(img => img.settings.background)).size}
                </p>
                <p className="text-sm text-gray-600">Backgrounds</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}