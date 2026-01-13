
import { GoogleGenAI, Type } from "@google/genai";
import { RewriteResponse, TextStats } from "../types";

export class HumanizerService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async auditText(text: string): Promise<TextStats> {
    const systemPrompt = `
      You are a specialized Linguistic Forensic Engine. Your task is to analyze the provided text for "AI Signatures."
      
      ANALYSIS CRITERIA:
      1. PERPLEXITY (0-100): Randomness and complexity of word choice. AI tends toward high-probability token chains.
      2. BURSTINESS (0-100): Variation in sentence structure and length. AI tends toward uniform rhythmic patterns.
      3. AI LIKELIHOOD (0-100): Probability of machine origin.
      
      IMPORTANT: If the text is long, analyze patterns across the entire document. Look for "semantic drifting" or "robotic consistency" which are markers of LLM output in large blocks.
      
      Output strictly as JSON.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: `Analyze this text for AI patterns:\n\n${text}`,
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
      You are a world-class Machine Learning Linguist and Adversarial Editor. 
      Target Persona: ${profession}.
      
      CORE MISSION: 
      Transform the provided text into a document that bypasses all state-of-the-art AI detectors (GPTZero, Originality.ai, etc.) while sounding like a seasoned ${profession}.
      
      STRATEGIC DIRECTIVES FOR LARGE DOCUMENTS:
      1. STYLE COHERENCE: Maintain the professional voice consistently across the entire text. Do not let the quality drift in longer sections.
      2. PERPLEXITY MAXIMIZATION: Replace common "AI-isms" with industry-specific vernacular, technical shorthand, and idiomatic expressions natural to a ${profession}.
      3. RADICAL BURSTINESS: Force a non-linear rhythm. Use fragments, rhetorical interjections, and varying clause complexity. 
      4. ADVERSARIAL FLOW: Intentionally break the "predictive perfection" of LLMs. Introduce nuanced human reasoning, personal perspective (where appropriate), and stylistic "flavor" that machines avoid.
      5. TRANSITION OVERHAUL: Replace "Furthermore," "Moreover," and "In conclusion" with organic transitions (e.g., "This leads us to...", "Looking at the data...", "The reality is...").

      Output strictly as JSON matching the schema.
    `;

    try {
      // Use pro for the actual humanization to ensure high quality on large texts
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Execute deep humanization for this document as a ${profession}:\n\n${text}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.85, // Slightly lower than 0.9 for better consistency in long texts
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
      throw new Error("The engine encountered an error processing your request. This usually happens with extremely complex structures. Please try again or slightly shorten the segment.");
    }
  }
}

export const humanizerService = new HumanizerService();
