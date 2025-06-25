
'use server';
/**
 * @fileOverview An AI flow for answering questions about a specific stock.
 *
 * - answerStockQuestion - Answers a user's question using provided context.
 * - StockQaInput - The input type for the flow.
 * - StockQaOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StockQaInputSchema = z.object({
  stockName: z.string(),
  question: z.string().describe("The user's question about the company."),
  financialsJson: z.string().describe("JSON string of the company's financial data over 5 years."),
  newsHeadlines: z.array(z.string()).describe("Recent news headlines related to the company or its sector."),
});
export type StockQaInput = z.infer<typeof StockQaInputSchema>;

const StockQaOutputSchema = z.object({
  answer: z.string().describe("A concise and helpful answer to the user's question, based on the provided context."),
});
export type StockQaOutput = z.infer<typeof StockQaOutputSchema>;


export async function answerStockQuestion(input: StockQaInput): Promise<StockQaOutput> {
  return stockQaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stockQaPrompt',
  input: { schema: StockQaInputSchema },
  output: { schema: StockQaOutputSchema },
  prompt: `You are an expert financial analyst AI assistant for {{stockName}}. Your task is to answer the user's question based *only* on the financial data and news context provided.

**Context Provided:**
1.  **Financial Data (as a JSON string):** This contains yearly and quarterly financial reports. Inside the \`yearly\` and \`quarterly\` arrays, you will find objects with \`period\`, \`revenue\`, \`netProfit\`, and \`debt\`. You must parse and analyze this JSON to answer financial questions.
    \`\`\`json
    {{{financialsJson}}}
    \`\`\`

2.  **Recent News Headlines:** These provide recent market sentiment and events.
    {{#each newsHeadlines}}
      - {{{this}}}
    {{/each}}

**Instructions:**
-   Analyze the provided financial data and news to formulate a concise, helpful answer to the user's question.
-   For financial questions like "What was the revenue in 2023?", you need to look inside the \`financialsJson\` data. For trend questions like "Is revenue growing?", you must compare data points over multiple periods.
-   If, after analyzing all the provided information, you genuinely cannot find an answer, then respond with: "I do not have enough information to answer that question from the provided context."

**User's Question:**
"{{{question}}}"

Provide your answer.`,
});

const stockQaFlow = ai.defineFlow(
  {
    name: 'stockQaFlow',
    inputSchema: StockQaInputSchema,
    outputSchema: StockQaOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
