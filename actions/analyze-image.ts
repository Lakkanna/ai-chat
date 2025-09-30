"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export interface ImageAnalysisResult {
  type: "food" | "exercise" | "unknown";
  confidence: number;
  extractedData: {
    type: "food" | "exercise";
    name: string;
    calories?: number;
    carbs?: number;
    protein?: number;
    fat?: number;
    quantity?: string;
    duration?: number;
    caloriesBurned?: number;
  };
  description: string;
}

// Define the schema for the AI response
const ImageAnalysisSchema = z.object({
  type: z.enum(["food", "exercise", "unknown"]),
  confidence: z.number().min(0).max(1),
  description: z.string(),
  extractedData: z.object({
    type: z.enum(["food", "exercise"]),
    name: z.string(),
    calories: z.number().optional(),
    carbs: z.number().optional(),
    protein: z.number().optional(),
    fat: z.number().optional(),
    quantity: z.string().optional(),
    duration: z.number().optional(), // in minutes for exercise
    caloriesBurned: z.number().optional(), // for exercise
  }),
});

export async function analyzeImageWithAI(
  base64Image: string
): Promise<ImageAnalysisResult> {
  try {
    if (!base64Image) {
      throw new Error("No image provided");
    }

    // Use OpenAI GPT-4 Vision to analyze the image
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ImageAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and determine if it shows food or exercise. 

For FOOD images, extract:
- Food name and description
- Estimated calories, carbs, protein, fat
- Quantity/serving size
- Provide a natural description of what you see

For EXERCISE images, extract:
- Exercise/activity name
- Estimated duration (in minutes)
- Estimated calories burned
- Provide a natural description of the activity

Be as accurate as possible with nutritional and exercise data. If you're unsure about the image content, set type to "unknown" and confidence to a lower value.`,
            },
            {
              type: "image",
              image: `data:image/jpeg;base64,${base64Image}`,
            },
          ],
        },
      ],
    });

    return result.object as ImageAnalysisResult;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image");
  }
}
