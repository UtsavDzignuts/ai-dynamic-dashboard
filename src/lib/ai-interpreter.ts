import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import {
  AIInterpretation,
  ComponentType,
  DatasetType,
  ChartType,
  Filter,
  FilterOperator,
  SortConfig,
  mockInterpretPrompt,
  mockInterpretMultiplePrompts,
} from "./mock-interpreter";

// Schema for structured output validation
const interpretationSchema = z.object({
  componentType: z.enum(["chart", "table", "card"]),
  datasetType: z.enum(["sales", "users", "products"]),
  chartType: z.enum(["bar", "line", "area"]).optional(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        operator: z.enum(["gt", "gte", "lt", "lte", "eq", "contains"]),
        value: z.union([z.string(), z.number()]),
      })
    )
    .optional(),
  title: z.string(),
  description: z.string(),
});

// Prompt template for the AI model (single component)
const promptTemplate = PromptTemplate.fromTemplate(`
You are a dashboard AI assistant. Interpret the user's request and determine which UI component, dataset, and filters to apply.

Available datasets:
- sales: Monthly sales data with fields: month, revenue, unitsSold, profit, category
- users: User directory with fields: id, name, email, role, status, sessionsThisMonth
- products: Product inventory with fields: id, name, category, price, stock, status, rating, totalSold

Available component types:
- chart: For visualizing trends and comparisons (bar, line, or area)
- table: For displaying detailed data in rows and columns
- card: For showing summary statistics and KPIs

Filter operators:
- gt: greater than
- gte: greater than or equal
- lt: less than
- lte: less than or equal
- eq: equals
- contains: string contains

User request: {prompt}

Respond ONLY with a valid JSON object (no markdown, no code blocks, no explanation) containing:
- componentType: "chart", "table", or "card"
- datasetType: "sales", "users", or "products"
- chartType: "bar", "line", or "area" (only if componentType is "chart")
- filters: array of filter objects with field, operator, value (only if user wants filtered data)
- title: A short title for the component
- description: A brief description
`);

// Prompt template for multiple components
const multiPromptTemplate = PromptTemplate.fromTemplate(`
You are a dashboard AI assistant. Interpret the user's request and determine which UI components, datasets, and filters to apply.
The user may be requesting MULTIPLE components. If so, return MULTIPLE JSON objects (one per line, no array wrapper).

Available datasets:
- sales: Monthly sales data with fields: month, revenue, unitsSold, profit, category
- users: User directory with fields: id, name, email, role, status, sessionsThisMonth
- products: Product inventory with fields: id, name, category, price, stock, status, rating, totalSold

Available component types:
- chart: For visualizing trends and comparisons (bar, line, or area)
- table: For displaying detailed data in rows and columns
- card: For showing summary statistics and KPIs

Filter operators:
- gt: greater than
- gte: greater than or equal
- lt: less than
- lte: less than or equal
- eq: equals
- contains: string contains

User request: {prompt}

Respond ONLY with valid JSON objects (no markdown, no code blocks, no explanation).
If the request is for multiple components/datasets, return one JSON object per line.
Each JSON object should contain:
- componentType: "chart", "table", or "card"
- datasetType: "sales", "users", or "products"
- chartType: "bar", "line", or "area" (only if componentType is "chart")
- filters: array of filter objects with field, operator, value (only if user wants filtered data)
- title: A short title for the component
- description: A brief description
`);

/**
 * LangChain-powered AI interpreter using Google Gemini.
 * Uses gemini-2.0-flash model for fast responses.
 */
export async function interpretPrompt(
  prompt: string
): Promise<AIInterpretation> {
  // Google AI Studio API Key
  const apiKey =
    process.env.GOOGLE_API_KEY || "AIzaSyCPKSkevWfFYOIVEbnNTy8Y-MgmW-t_sxM";

  if (!apiKey) {
    console.log("No Google API key, using mock interpreter");
    return mockInterpretPrompt(prompt);
  }
  console.log("prompt", prompt);
  try {
    // Initialize Google Gemini model via LangChain
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite", // Fast model available in Google AI Studio
      apiKey: apiKey,
      maxRetries: 2,
    });

    console.log("modal initialized", model);

    // Format prompt and invoke model
    const formattedPrompt = await promptTemplate.format({ prompt });
    const response = await model.invoke(formattedPrompt);
    console.log("response", response);
    // Extract text content from response
    const content =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    console.log("Gemini response:", content);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const validated = interpretationSchema.parse(parsed);

      return {
        componentType: validated.componentType as ComponentType,
        datasetType: validated.datasetType as DatasetType,
        chartType: validated.chartType as ChartType | undefined,
        filters: validated.filters as Filter[] | undefined,
        title: validated.title,
        description: validated.description,
      };
    }

    // Fallback to mock if parsing fails
    return mockInterpretPrompt(prompt);
  } catch (error) {
    console.error("AI interpretation failed, using mock:", error);
    return mockInterpretPrompt(prompt);
  }
}

/**
 * Helper function to extract all JSON objects from a string
 */
function extractAllJsonObjects(content: string): string[] {
  const jsonObjects: string[] = [];
  let braceCount = 0;
  let currentJson = "";
  let inJson = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === "{") {
      if (!inJson) {
        inJson = true;
        currentJson = "";
      }
      braceCount++;
      currentJson += char;
    } else if (char === "}") {
      braceCount--;
      currentJson += char;
      if (braceCount === 0 && inJson) {
        jsonObjects.push(currentJson);
        inJson = false;
        currentJson = "";
      }
    } else if (inJson) {
      currentJson += char;
    }
  }

  return jsonObjects;
}

/**
 * Multi-dataset interpreter for handling multiple datasets in one prompt.
 * Uses AI to parse prompts that request multiple components (e.g., "show users table and products table").
 */
export async function interpretMultiplePrompts(
  prompt: string
): Promise<AIInterpretation[]> {
  const apiKey =
    process.env.GOOGLE_API_KEY || "AIzaSyCPKSkevWfFYOIVEbnNTy8Y-MgmW-t_sxM";

  if (!apiKey) {
    console.log(
      "No Google API key, using mock interpreter for multiple prompts"
    );
    return mockInterpretMultiplePrompts(prompt);
  }

  try {
    // Initialize Google Gemini model via LangChain
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite",
      apiKey: apiKey,
      maxRetries: 2,
    });

    // Format prompt with multi-component template and invoke model
    const formattedPrompt = await multiPromptTemplate.format({ prompt });
    const response = await model.invoke(formattedPrompt);

    // Extract text content from response
    const content =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    console.log("Gemini multi-response:", content);

    // Extract all JSON objects from the response
    const jsonStrings = extractAllJsonObjects(content);

    if (jsonStrings.length > 0) {
      const interpretations: AIInterpretation[] = [];

      for (const jsonStr of jsonStrings) {
        try {
          const parsed = JSON.parse(jsonStr);
          const validated = interpretationSchema.parse(parsed);

          interpretations.push({
            componentType: validated.componentType as ComponentType,
            datasetType: validated.datasetType as DatasetType,
            chartType: validated.chartType as ChartType | undefined,
            filters: validated.filters as Filter[] | undefined,
            title: validated.title,
            description: validated.description,
          });
        } catch (parseError) {
          console.error("Failed to parse individual JSON object:", parseError);
          // Continue to next object if one fails
        }
      }

      if (interpretations.length > 0) {
        return interpretations;
      }
    }

    // Fallback to mock if parsing fails
    return mockInterpretMultiplePrompts(prompt);
  } catch (error) {
    console.error("AI multi-interpretation failed, using mock:", error);
    return mockInterpretMultiplePrompts(prompt);
  }
}

// Re-export types
export type {
  AIInterpretation,
  ComponentType,
  DatasetType,
  ChartType,
  Filter,
  FilterOperator,
  SortConfig,
};
