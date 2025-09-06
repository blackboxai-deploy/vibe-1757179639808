"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SceneSettings } from "@/lib/types";

interface ImageGeneratorProps {
  onGenerate: (settings: SceneSettings) => void;
  isGenerating: boolean;
  progress: number;
  defaultSettings: SceneSettings;
}

export function ImageGenerator({ onGenerate, isGenerating, progress, defaultSettings }: ImageGeneratorProps) {
  const [settings, setSettings] = useState<SceneSettings>(defaultSettings);

  const handleGenerate = () => {
    onGenerate(settings);
  };

  const updateSetting = <K extends keyof SceneSettings>(key: K, value: SceneSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
          🎨 Scene Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lighting Settings */}
        <div className="space-y-2">
          <Label htmlFor="lighting" className="text-sm font-medium text-gray-700">
            Lighting Style
          </Label>
          <Select value={settings.lighting} onValueChange={(value: SceneSettings['lighting']) => updateSetting('lighting', value)}>
            <SelectTrigger className="bg-white border-orange-200">
              <SelectValue placeholder="Select lighting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="warm">🌅 Warm Natural Light</SelectItem>
              <SelectItem value="cool">❄️ Cool Daylight</SelectItem>
              <SelectItem value="dramatic">🎭 Dramatic Shadows</SelectItem>
              <SelectItem value="natural">☀️ Soft Natural</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Background Settings */}
        <div className="space-y-2">
          <Label htmlFor="background" className="text-sm font-medium text-gray-700">
            Background Setting
          </Label>
          <Select value={settings.background} onValueChange={(value: SceneSettings['background']) => updateSetting('background', value)}>
            <SelectTrigger className="bg-white border-orange-200">
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kitchen">🏠 Kitchen Counter</SelectItem>
              <SelectItem value="wooden-table">🪵 Wooden Table</SelectItem>
              <SelectItem value="marble">⚪ Marble Surface</SelectItem>
              <SelectItem value="rustic">🍂 Rustic Setting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sauce Type */}
        <div className="space-y-2">
          <Label htmlFor="sauce" className="text-sm font-medium text-gray-700">
            Sauce Type
          </Label>
          <Select value={settings.sauce} onValueChange={(value: SceneSettings['sauce']) => updateSetting('sauce', value)}>
            <SelectTrigger className="bg-white border-orange-200">
              <SelectValue placeholder="Select sauce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tomato">🍅 Tomato Sauce</SelectItem>
              <SelectItem value="mint-chutney">🌿 Mint Chutney</SelectItem>
              <SelectItem value="tamarind">🟤 Tamarind Sauce</SelectItem>
              <SelectItem value="spicy-red">🌶️ Spicy Red Chutney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Plate Style */}
        <div className="space-y-2">
          <Label htmlFor="plate" className="text-sm font-medium text-gray-700">
            Plate Style
          </Label>
          <Select value={settings.plate} onValueChange={(value: SceneSettings['plate']) => updateSetting('plate', value)}>
            <SelectTrigger className="bg-white border-orange-200">
              <SelectValue placeholder="Select plate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wooden-rustic">🪵 Rustic Wooden</SelectItem>
              <SelectItem value="ceramic-handmade">🏺 Handmade Ceramic</SelectItem>
              <SelectItem value="modern-white">⚪ Modern White</SelectItem>
              <SelectItem value="traditional">🎨 Traditional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Camera Angle */}
        <div className="space-y-2">
          <Label htmlFor="angle" className="text-sm font-medium text-gray-700">
            Camera Angle
          </Label>
          <Select value={settings.angle} onValueChange={(value: SceneSettings['angle']) => updateSetting('angle', value)}>
            <SelectTrigger className="bg-white border-orange-200">
              <SelectValue placeholder="Select angle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="three-quarter">📐 Three-Quarter View</SelectItem>
              <SelectItem value="top-down">⬇️ Top-Down</SelectItem>
              <SelectItem value="side-view">➡️ Side View</SelectItem>
              <SelectItem value="close-up">🔍 Close-Up Detail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Generating your 3D scene...</span>
              <span className="text-orange-600 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-orange-100" />
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 text-lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </div>
          ) : (
            "🎨 Generate 3D Samosa Scene"
          )}
        </Button>

        {/* Description */}
        <div className="bg-orange-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-2">What you'll get:</p>
          <ul className="space-y-1 text-xs">
            <li>• Hyper-realistic 3D rendered samosa</li>
            <li>• Golden-brown crispy texture with visible layers</li>
            <li>• Authentic potato and pea filling glimpses</li>
            <li>• Complementary sauce in ceramic bowl</li>
            <li>• Professional food photography lighting</li>
            <li>• Contextual background elements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}