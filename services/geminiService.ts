
import { GoogleGenAI, Type } from "@google/genai";
import { RewriteResponse, TextStats } from "../types";

export class HumanizerService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async auditText(text: string): Promise<TextStats> {
    const systemPrompt = `
      You are a linguistic analysis engine. Analyze the provided text and estimate its AI-generated probability.
      Calculate:
      1. PERPLEXITY: Measure of text randomness (0-100).
      2. BURSTINESS: Variation in sentence length and structure (0-100).
      3. AI LIKELIHOOD: Overall probability that the text was AI-generated (0-100).
      
      Output strictly as JSON.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview", // Use flash for faster real-time auditing
        contents: `Analyze this text:\n\n${text}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              perplexity: { type: Type.NUMBER },
              burstiness: { type: Type.NUMBER },
              aiLikelihood: { type: Type.NUMBER }
            },
            required: ["perplexity", "burstiness", "aiLikelihood"]
          }
        }
      });

      return JSON.parse(response.text.trim()) as TextStats;
    } catch (error) {
      console.error("Audit Error:", error);
      throw error;
    }
  }

  async humanizeText(text: string, profession: string): Promise<RewriteResponse> {
    const systemPrompt = `
      You are a world-class Machine Learning Linguist and Expert Editor with 15 years of experience in adversarial LLM training. 
      Your mission is to rewrite the provided AI-generated text so it becomes indistinguishable from a human professional in the field of: ${profession}.

      HUMANIZATION RULES (Machine Learning Perspective):
      1. PERPLEXITY INJECTION: Avoid the most predictable next-token choices. Use varied vocabulary that a professional in ${profession} would naturally use, including industry-specific idioms or shorthand.
      2. BURSTINESS CALIBRATION: AI writes with consistent sentence lengths. You MUST vary sentence structure significantly. Mix short, punchy fragments with long, complex-compound sentences.
      3. ELIMINATE "AI MARKERS": Remove transitions like "In conclusion," "Moreover," "Furthermore," or "It is important to note." Avoid "hedging" language unless it's a specific stylistic choice for the profession.
      4. VOICE INJECTION: Adopt the specific persona of a ${profession}.
      5. ADVERSARIAL BYPASS: Focus on breaking the "smoothness" and "perfection" that AI detectors (like GPTZero) flag. Introduce subtle human imperfections like rhetorical questions, personal perspective (where appropriate), and varying degrees of formality.

      OUTPUT FORMAT:
      You must respond in a strict JSON format matching the schema provided.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Humanize the following text as a ${profession}:\n\n${text}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.9,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              humanizedText: { type: Type.STRING },
              originalStats: {
                type: Type.OBJECT,
                properties: {
                  perplexity: { type: Type.NUMBER },
                  burstiness: { type: Type.NUMBER },
                  aiLikelihood: { type: Type.NUMBER }
                },
                required: ["perplexity", "burstiness", "aiLikelihood"]
              },
              humanizedStats: {
                type: Type.OBJECT,
                properties: {
                  perplexity: { type: Type.NUMBER },
                  burstiness: { type: Type.NUMBER },
                  aiLikelihood: { type: Type.NUMBER }
                },
                required: ["perplexity", "burstiness", "aiLikelihood"]
              },
              changesMade: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["humanizedText", "originalStats", "humanizedStats", "changesMade"]
          }
        }
      });

      const jsonStr = response.text.trim();
      return JSON.parse(jsonStr) as RewriteResponse;
    } catch (error) {
      console.error("Humanization Error:", error);
      throw new Error("Failed to process text. Ensure your input is substantial and valid.");
    }
  }
}

export const humanizerService = new HumanizerService();
