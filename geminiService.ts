import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
// Note: In a real production app, you might want to proxy this through a backend
// to keep the key secure, but for this demo, we use the env var directly.
const ai = new GoogleGenAI({ apiKey });

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const model = "gemini-2.5-flash"; // Good balance of vision capabilities and speed

    const prompt = `
      You are an expert digital forensics image analyst specializing in detecting AI-generated content (e.g., Midjourney, DALL-E, Stable Diffusion). 
      Analyze the provided image for specific visual artifacts that distinguish AI-generated images from real photography or human artwork.
      
      Look for:
      1. Anatomical inconsistencies (hands, eyes, teeth).
      2. Unnatural lighting or shadows.
      3. Strange background blurring or bokeh inconsistencies.
      4. Text rendering errors (gibberish text).
      5. Texture repetition or "glossy/plastic" skin look.
      6. Pixel-level artifacts common in diffusion models.

      Provide a strict JSON response estimating the likelihood of this image being AI-generated.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiLikelihood: { type: Type.NUMBER, description: "Percentage probability (0-100) that the image is AI generated" },
            humanLikelihood: { type: Type.NUMBER, description: "Percentage probability (0-100) that the image is Human made" },
            verdict: { type: Type.STRING, enum: ["LIKELY_AI", "LIKELY_HUMAN", "UNCERTAIN"] },
            confidenceScore: { type: Type.NUMBER, description: "Overall confidence in the verdict (0-100)" },
            indicators: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of specific visual cues found (e.g., 'Asymmetrical eyes', 'Perfect skin texture')"
            },
            analysis: { type: Type.STRING, description: "A detailed paragraph explaining the reasoning." },
            technicalDetails: {
              type: Type.OBJECT,
              properties: {
                lighting: { type: Type.STRING },
                texture: { type: Type.STRING },
                composition: { type: Type.STRING },
                artifacts: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI model");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
