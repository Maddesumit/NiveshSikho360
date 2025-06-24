'use server';
/**
 * @fileOverview An AI flow for answering questions about a specific stock.
 *
 * - answerStockQuestion - Answers a user's question using provided context.
 * - StockQaInput - The input type for the flow.
 * - StockQaOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import type { FinancialData } from '@/data/financials';
import { z } from 'zod';

const StockQaInputSchema = z.object({
  stockName: z.string(),
  question: z.string().describe("The user's question about the company."),
  financials: z.any().describe("JSON object of the company's financial data over 5 years."),
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
  prompt: `You are a helpful AI financial assistant specializing in {{stockName}}. Your goal is to answer the user's question accurately and concisely based *only* on the context provided below. Do not use any external knowledge. If the answer cannot be found in the context, say "I do not have enough information to answer that question."

**Context:**
1.  **Financial Data:** {{json stringify=financials}}
2.  **Recent News Headlines:**
{{#each newsHeadlines}}
    - {{{this}}}
{{/each}}

**User's Question:**
"{{{question}}}"

Provide your answer now.`,
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
