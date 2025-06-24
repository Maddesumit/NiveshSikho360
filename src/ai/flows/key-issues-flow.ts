'use server';
/**
 * @fileOverview An AI flow for identifying key issues for a company.
 *
 * - getKeyIssues - Analyzes financials and news to find key risks.
 * - KeyIssuesInput - The input type for the flow.
 * - KeyIssuesOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import type { FinancialData } from '@/data/financials';
import { z } from 'zod';

const KeyIssuesInputSchema = z.object({
  stockSymbol: z.string(),
  stockName: z.string(),
  financials: z.any().describe("JSON object of the company's financial data over 5 years."),
  newsHeadlines: z.array(z.string()).describe("Recent news headlines related to the company or its sector."),
});
export type KeyIssuesInput = z.infer<typeof KeyIssuesInputSchema>;

const KeyIssuesOutputSchema = z.object({
  keyIssues: z.array(z.object({
    issue: z.string().describe("A concise summary of the key issue or risk."),
    impact: z.string().describe("A brief, one-sentence analysis of the potential impact on the company."),
  })).describe("A list of 2-3 key issues or risks identified from the data."),
});
export type KeyIssuesOutput = z.infer<typeof KeyIssuesOutputSchema>;


export async function getKeyIssues(input: KeyIssuesInput): Promise<KeyIssuesOutput> {
  return keyIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'keyIssuesPrompt',
  input: { schema: KeyIssuesInputSchema },
  output: { schema: KeyIssuesOutputSchema },
  prompt: `You are a senior financial risk analyst. Your task is to identify the top 2-3 key issues, risks, or concerns for a company based on its financial data and recent news.

Analyze the following information for {{stockName}} ({{stockSymbol}}):
- **Financials:** {{json stringify=financials}}
- **Recent News:**
{{#each newsHeadlines}}
  - {{{this}}}
{{/each}}

Based on your analysis, generate a list of key issues. For each issue, provide a concise summary and its potential impact. Focus on the most significant challenges the company might be facing (e.g., declining profitability, rising debt, market share loss, supply chain disruptions).`,
});

const keyIssuesFlow = ai.defineFlow(
  {
    name: 'keyIssuesFlow',
    inputSchema: KeyIssuesInputSchema,
    outputSchema: KeyIssuesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
