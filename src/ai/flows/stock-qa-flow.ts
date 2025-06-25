
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
  prompt: `You are a helpful AI financial assistant specializing in {{stockName}}. Your goal is to answer the user's question accurately and concisely.

**Instructions:**
1.  Your answer MUST be based *only* on the context provided below.
2.  The context includes financial data as a JSON string and a list of recent news headlines. You must analyze both to formulate your answer.
3.  If the provided context does not contain enough information to answer the question, you MUST respond with the exact phrase: "I do not have enough information to answer that question."
4.  Keep your answer brief and to the point.

**Context:**
- **Financial Data (JSON):**
{{{financialsJson}}}

- **Recent News Headlines:**
{{#each newsHeadlines}}
  - {{{this}}}
{{/each}}

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
