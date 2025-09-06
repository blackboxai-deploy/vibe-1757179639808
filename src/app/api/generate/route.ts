import { NextRequest, NextResponse } from 'next/server';
import { SceneSettings } from '@/lib/types';

// Base prompt for 3D samosa scene
const BASE_PROMPT = `Create a hyper-realistic 3D scene featuring a freshly fried samosa placed on a rustic wooden plate. The samosa should have a golden-brown, crispy, flaky texture with visible layers of pastry and slight bubbling on the surface indicating perfect frying. The samosa is triangular in shape, with slightly crimped edges and a few tiny cracks revealing a warm, spiced potato and pea filling inside.

Next to the samosa, place a small ceramic bowl filled with vibrant red tomato sauce. The sauce should have a smooth, glossy texture with a few visible specks of herbs like basil and oregano floating on top. The bowl has a subtle handmade look with a matte finish and slight imperfections for realism.

Add a stainless steel fork resting beside the plate, with slight reflections and a clean polished look. The overall mood is inviting and appetizing, evoking the feeling of a cozy homemade snack.`;

// Enhance prompt based on user settings
function enhancePrompt(basePrompt: string, settings: SceneSettings): string {
  let enhancedPrompt = basePrompt;

  // Lighting enhancements
  const lightingMap = {
    'warm': 'The scene is lit with warm, golden natural light coming from the left side, casting soft shadows and highlighting the textures of the samosa and sauce.',
    'cool': 'The scene is illuminated with cool, crisp daylight that creates sharp contrasts and brings out the vibrant colors of the food.',
    'dramatic': 'Dramatic lighting with strong directional light creates deep shadows and highlights, giving the scene a professional photography look.',
    'natural': 'Soft, diffused natural lighting evenly illuminates the scene, creating a gentle and appetizing atmosphere.'
  };

  // Background enhancements
  const backgroundMap = {
    'kitchen': 'The background is a blurred modern kitchen countertop with hints of fresh ingredients like tomatoes, green chilies, and coriander leaves scattered softly in the background to add context.',
    'wooden-table': 'Set on a beautiful rustic wooden table with natural wood grain visible, scattered flour dusting, and kitchen utensils in the soft-focused background.',
    'marble': 'Placed on an elegant marble surface with subtle veining, creating a luxurious and clean backdrop for the food photography.',
    'rustic': 'The setting features a weathered wooden surface with vintage kitchen implements and traditional Indian spices visible in the artistic background blur.'
  };

  // Sauce modifications
  const sauceMap = {
    'tomato': 'vibrant red tomato sauce with smooth, glossy texture and herb specks',
    'mint-chutney': 'fresh green mint chutney with a vibrant emerald color and small mint leaf pieces visible',
    'tamarind': 'rich brown tamarind sauce with a glossy, thick consistency and golden-brown color',
    'spicy-red': 'fiery red chili sauce with visible red chili flakes and a slightly thick, glossy texture'
  };

  // Plate modifications
  const plateMap = {
    'wooden-rustic': 'rustic wooden plate with natural wood grain and slight imperfections',
    'ceramic-handmade': 'handmade ceramic plate with artisanal glazing and subtle color variations',
    'modern-white': 'clean, modern white ceramic plate with smooth finish and minimalist design',
    'traditional': 'traditional brass or copper plate with intricate patterns and aged patina'
  };

  // Camera angle modifications
  const angleMap = {
    'three-quarter': 'Shot from a three-quarter angle view that shows depth and dimension of the food arrangement',
    'top-down': 'Captured from directly above in a flat lay style, showing the complete arrangement from bird\'s eye view',
    'side-view': 'Photographed from the side to showcase the samosa\'s triangular profile and filling glimpses',
    'close-up': 'Intimate close-up shot focusing on the texture details of the crispy samosa surface and steam'
  };

  // Replace the default elements with customized versions
  enhancedPrompt = enhancedPrompt
    .replace('The scene is lit with warm, natural light coming from the left side, casting soft shadows and highlighting the textures of the samosa and sauce.', lightingMap[settings.lighting])
    .replace('The background is a blurred kitchen countertop with hints of fresh ingredients like tomatoes, green chilies, and coriander leaves scattered softly in the background to add context.', backgroundMap[settings.background])
    .replace('vibrant red tomato sauce', sauceMap[settings.sauce])
    .replace('rustic wooden plate', plateMap[settings.plate]);

  // Add camera angle instruction
  enhancedPrompt += ` ${angleMap[settings.angle]}`;

  // Add final enhancement for 3D realism
  enhancedPrompt += ` Render in photorealistic 3D with high detail, professional food photography lighting, and restaurant-quality presentation. The image should be sharp, well-composed, and visually appetizing with perfect depth of field.`;

  return enhancedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body as { settings: SceneSettings };

    if (!settings) {
      return NextResponse.json({ 
        success: false, 
        error: 'Settings are required' 
      }, { status: 400 });
    }

    // Generate enhanced prompt
    const enhancedPrompt = enhancePrompt(BASE_PROMPT, settings);

    // Call Replicate API through custom endpoint
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'sarswatsunilkumar3@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', response.status, errorData);
      return NextResponse.json({ 
        success: false, 
        error: `Generation failed: ${response.status} ${response.statusText}` 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract image URL from response
    let imageUrl: string | null = null;
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      
      // The API might return the image URL in different formats
      if (typeof content === 'string') {
        // Look for image URLs in the response
        const urlMatch = content.match(/https:\/\/[^\s]+\.(?:jpg|jpeg|png|webp)/gi);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        } else {
          imageUrl = content; // Assume the whole content is the URL
        }
      } else if (content && typeof content === 'object') {
        // Handle structured response
        imageUrl = content.url || content.image_url || content.output;
      }
    }

    if (!imageUrl) {
      console.error('No image URL found in response:', data);
      return NextResponse.json({ 
        success: false, 
        error: 'No image URL received from generation service' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: enhancedPrompt
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}