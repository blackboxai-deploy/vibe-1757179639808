export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  settings: SceneSettings;
}

export interface SceneSettings {
  lighting: 'warm' | 'cool' | 'dramatic' | 'natural';
  background: 'kitchen' | 'wooden-table' | 'marble' | 'rustic';
  sauce: 'tomato' | 'mint-chutney' | 'tamarind' | 'spicy-red';
  plate: 'wooden-rustic' | 'ceramic-handmade' | 'modern-white' | 'traditional';
  angle: 'top-down' | 'side-view' | 'three-quarter' | 'close-up';
}

export interface GenerationRequest {
  prompt: string;
  settings: SceneSettings;
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  currentImage: string | null;
  history: GeneratedImage[];
  error: string | null;
}