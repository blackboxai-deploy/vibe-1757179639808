"use client";

import { useState } from "react";
import { ImageGenerator } from "@/components/ImageGenerator";
import { ImageDisplay } from "@/components/ImageDisplay";
import { GenerationHistory } from "@/components/GenerationHistory";
import { GeneratedImage, GenerationState, SceneSettings } from "@/lib/types";

export default function HomePage() {
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    currentImage: null,
    history: [],
    error: null,
  });

  const defaultSettings: SceneSettings = {
    lighting: 'warm',
    background: 'kitchen',
    sauce: 'tomato',
    plate: 'wooden-rustic',
    angle: 'three-quarter'
  };

  const handleGenerate = async (settings: SceneSettings) => {
    setGenerationState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      error: null
    }));

    try {
      // Progress simulation during generation
      const progressInterval = setInterval(() => {
        setGenerationState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 90)
        }));
      }, 2000);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();

      if (data.success && data.imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt: data.prompt || "3D Hyper-realistic Samosa Scene",
          timestamp: new Date(),
          settings
        };

        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          progress: 100,
          currentImage: data.imageUrl,
          history: [newImage, ...prev.history],
          error: null
        }));
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      setGenerationState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Generation failed'
      }));
    }
  };

  const handleImageSelect = (image: GeneratedImage) => {
    setGenerationState(prev => ({
      ...prev,
      currentImage: image.url
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            3D Samosa <span className="text-orange-600">Generator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create hyper-realistic 3D samosa scenes with AI-powered food photography. 
            Customize lighting, backgrounds, and styling for perfect culinary art.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Controls */}
          <div className="lg:col-span-1">
            <ImageGenerator
              onGenerate={handleGenerate}
              isGenerating={generationState.isGenerating}
              progress={generationState.progress}
              defaultSettings={defaultSettings}
            />
          </div>

          {/* Image Display */}
          <div className="lg:col-span-2">
            <ImageDisplay
              currentImage={generationState.currentImage}
              isGenerating={generationState.isGenerating}
              progress={generationState.progress}
              error={generationState.error}
            />
          </div>
        </div>

        {/* Generation History */}
        {generationState.history.length > 0 && (
          <div className="mt-12">
            <GenerationHistory
              images={generationState.history}
              onImageSelect={handleImageSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}