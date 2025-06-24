'use server';
/**
 * @fileOverview An AI flow for generating stock trade recommendations.
 *
 * - getTradeRecommendations - A function that returns personalized trade recommendations.
 * - RecommendationFlowInput - The input type for the flow.
 * - RecommendationFlowOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StockInfoSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  sector: z.string(),
  price: z.number(),
  changePercent: z.number(),
});

const HoldingInfoSchema = z.object({
    stock: StockInfoSchema,
    quantity: z.number(),
    avgPrice: z.number(),
});

const RecommendationFlowInputSchema = z.object({
  holdings: z.array(HoldingInfoSchema),
  cash: z.number(),
  stocks: z.array(StockInfoSchema),
});
export type RecommendationFlowInput = z.infer<typeof RecommendationFlowInputSchema>;

const RecommendationSchema = z.object({
  stockSymbol: z.string().describe("The symbol of the stock being recommended for a trade, e.g., 'RELIANCE'."),
  action: z.enum(["BUY", "SELL"]).describe("The recommended action, either BUY or SELL."),
  category: z.enum(["Sector Diversification", "Growth Opportunity", "Value Play", "Profit Taking"]).describe("The strategic category of the recommendation."),
  reason: z.string().describe("A concise, one-sentence explanation for the recommendation, focusing on technical or market indicators. e.g., 'This stock is showing strong upward momentum.' or 'Consider taking profits as the stock appears overvalued.'"),
  confidence: z.number().min(0).max(1).describe("The AI's confidence in this recommendation, from 0 (low) to 1 (high).")
});

const RecommendationFlowOutputSchema = z.object({
    recommendations: z.array(RecommendationSchema).describe("A list of 3-4 trade recommendations tailored to the user."),
});
export type RecommendationFlowOutput = z.infer<typeof RecommendationFlowOutputSchema>;


export async function getTradeRecommendations(input: RecommendationFlowInput): Promise<RecommendationFlowOutput> {
  return tradeRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tradeRecommendationPrompt',
  input: { schema: RecommendationFlowInputSchema },
  output: { schema: RecommendationFlowOutputSchema },
  prompt: `You are an expert financial analyst AI for the Indian stock market. Your goal is to provide personalized, actionable, and educational trade recommendations.

Analyze the user's current portfolio, including their cash balance and existing holdings. Also, consider the provided list of all available stocks with their current prices and recent performance.

Based on this complete picture, generate 3-4 trade recommendations. For each recommendation, provide the stock symbol, whether to BUY or SELL, a strategic category, a clear and concise reason for the suggestion, and a confidence score.

Here is the user's data:
- Cash on hand: {{cash}} INR
- Current Holdings:
{{#each holdings}}
  - {{stock.symbol}}: {{quantity}} shares at an average price of {{avgPrice}} INR. Current price is {{stock.price}}. Sector: {{stock.sector}}.
{{else}}
  - No holdings yet.
{{/each}}

Here is the list of available stocks and their current data:
{{#each stocks}}
- {{symbol}} ({{name}}): Current Price: {{price}} INR, Change: {{changePercent}}%, Sector: {{sector}}
{{/each}}

Guidelines for recommendations:
1.  **Categorization:** Assign a category to each recommendation:
    *   'Sector Diversification': Suggest if the user is over-concentrated in one sector.
    *   'Growth Opportunity': Identify stocks with strong upward momentum or in a trending sector.
    *   'Value Play': Identify stocks that seem undervalued compared to their peers or historical data.
    *   'Profit Taking'/'Loss Cutting': For SELL recommendations, consider if a stock is overvalued or if it's wise to cut losses.
2.  **Cash Utilization:** For BUY recommendations, ensure the user has enough cash. Suggest reasonable quantities.
3.  **Reasoning:** The 'reason' is crucial. It should be educational, mentioning concepts like momentum, valuation, or sector trends in simple terms.

Generate the recommendations now.`,
});

const tradeRecommendationFlow = ai.defineFlow(
  {
    name: 'tradeRecommendationFlow',
    inputSchema: RecommendationFlowInputSchema,
    outputSchema: RecommendationFlowOutputSchema,
  },
  async (input) => {
    // To keep the prompt efficient, let's work with a subset of the most relevant stocks.
    const interestingStocks = input.stocks
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 35); // Top 35 movers

    const { output } = await prompt({
        ...input,
        stocks: interestingStocks,
    });
    return output!;
  }
);
