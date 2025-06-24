'use server';
/**
 * @fileOverview An AI flow for analyzing financial news sentiment.
 *
 * - getNewsSentiment - Analyzes a news article and returns sentiment and impact.
 * - NewsSentimentInput - The input type for the flow.
 * - NewsSentimentOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NewsSentimentInputSchema = z.object({
  headline: z.string().describe("The headline of the news article."),
  content: z.string().describe("The summary or content of the news article."),
  stockSymbols: z.array(z.string()).describe("A list of stock symbols potentially related to the news."),
});
export type NewsSentimentInput = z.infer<typeof NewsSentimentInputSchema>;

const NewsSentimentOutputSchema = z.object({
  sentiment: z.enum(["Positive", "Negative", "Neutral"]).describe("The overall sentiment of the news for the financial markets."),
  impactedStocks: z.array(z.object({
    symbol: z.string().describe("The stock symbol that is most likely to be impacted."),
    impact: z.string().describe("A brief, one-sentence analysis of the potential impact on this specific stock. e.g., 'May see upward pressure due to strong earnings report.'"),
  })).describe("A list of stocks mentioned or implied in the article and their potential impact."),
  reasoning: z.string().describe("A brief, one-sentence explanation for the sentiment analysis, highlighting the key information from the article."),
});
export type NewsSentimentOutput = z.infer<typeof NewsSentimentOutputSchema>;

export async function getNewsSentiment(input: NewsSentimentInput): Promise<NewsSentimentOutput> {
  return newsSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'newsSentimentPrompt',
  input: { schema: NewsSentimentInputSchema },
  output: { schema: NewsSentimentOutputSchema },
  prompt: `You are a financial news analyst AI. Your task is to analyze the following news article and determine its sentiment from an investor's perspective.

Analyze the provided news headline and content. Identify the overall sentiment (Positive, Negative, or Neutral). Then, identify the primary stock symbol from the list '{{stockSymbols}}' that would be affected. Finally, provide a brief reasoning for your analysis and the potential impact on the stock.

News Headline: {{{headline}}}
News Content: {{{content}}}

Your analysis should be concise and direct. Focus on the most likely market reaction.`,
});

const newsSentimentFlow = ai.defineFlow(
  {
    name: 'newsSentimentFlow',
    inputSchema: NewsSentimentInputSchema,
    outputSchema: NewsSentimentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
