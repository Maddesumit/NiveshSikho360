'use server';
/**
 * @fileOverview An AI flow for predicting short-term stock price movement.
 *
 * - getTradeForecast - Analyzes a stock's volatility and news to predict a price range.
 * - TradeForecastInput - The input type for the flow.
 * - TradeForecastOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TradeForecastInputSchema = z.object({
  stockSymbol: z.string(),
  stockName: z.string(),
  currentPrice: z.number(),
  priceHistory: z.array(z.number()).describe("The closing prices for the last 60 days."),
  relevantNews: z.array(z.string()).describe("Recent news headlines related to this stock or its sector."),
});
export type TradeForecastInput = z.infer<typeof TradeForecastInputSchema>;

const TradeForecastOutputSchema = z.object({
  bestCase: z.number().describe("The optimistic best-case price prediction for the next 7 days."),
  worstCase: z.number().describe("The pessimistic worst-case price prediction for the next 7 days."),
  reasoning: z.string().describe("A brief, single-sentence explanation for the forecast, citing volatility or news sentiment."),
});
export type TradeForecastOutput = z.infer<typeof TradeForecastOutputSchema>;

export async function getTradeForecast(input: TradeForecastInput): Promise<TradeForecastOutput> {
  return tradeForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tradeForecastPrompt',
  input: { schema: TradeForecastInputSchema },
  output: { schema: TradeForecastOutputSchema },
  prompt: `You are a quantitative financial analyst. Your task is to provide a short-term (7-day) price forecast for a stock.

Analyze the provided data:
- Stock: {{stockName}} ({{stockSymbol}})
- Current Price: {{currentPrice}}
- Price History (last 60 days): Used to gauge volatility.
- Relevant News: Used to gauge market sentiment.

Based on the volatility from the price history and the sentiment from the news, predict a plausible best-case and worst-case price for the stock over the next 7 trading days. Also provide a concise, one-sentence reasoning for your forecast.

Relevant News Headlines:
{{#if relevantNews}}
  {{#each relevantNews}}
  - {{{this}}}
  {{/each}}
{{else}}
  - No specific news provided. Base analysis on price volatility.
{{/if}}

Generate the forecast now.`,
});

const tradeForecastFlow = ai.defineFlow(
  {
    name: 'tradeForecastFlow',
    inputSchema: TradeForecastInputSchema,
    outputSchema: TradeForecastOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
