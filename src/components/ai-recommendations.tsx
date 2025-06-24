"use client";

import { useState, useEffect, useCallback } from 'react';
import { useNiveshStore } from '@/hooks/use-trade-store';
import { getTradeRecommendations, RecommendationFlowOutput } from '@/ai/flows/recommendation-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import TradeDialog from './trade-dialog';
import type { Stock } from '@/data/stocks';
import { Badge } from './ui/badge';

export default function AiRecommendations() {
  const { state, stocks, getStockPrice } = useNiveshStore();
  const [recommendations, setRecommendations] = useState<RecommendationFlowOutput['recommendations']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isTradeDialogOpen, setTradeDialogOpen] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stockInfo = stocks.map(s => ({
        symbol: s.symbol,
        name: s.name,
        sector: s.sector,
        price: s.price,
        changePercent: s.changePercent,
      }));

      const holdingInfo = state.holdings.map(h => ({
        stock: {
            symbol: h.stock.symbol,
            name: h.stock.name,
            sector: h.stock.sector,
            price: getStockPrice(h.stock.symbol),
            changePercent: stocks.find(s => s.symbol === h.stock.symbol)?.changePercent ?? 0,
        },
        quantity: h.quantity,
        avgPrice: h.avgPrice,
      }));

      const input = {
        cash: state.cash,
        holdings: holdingInfo,
        stocks: stockInfo,
      };
      
      const result = await getTradeRecommendations(input);
      setRecommendations(result.recommendations);
    } catch (err) {
      console.error("Failed to fetch AI recommendations:", err);
      setError("Could not load AI insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [state.cash, state.holdings, stocks, getStockPrice]);

  useEffect(() => {
    // We only want to fetch recommendations on initial load, not on every
    // price update. The user can use the refresh button for new insights.
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTradeClick = (stockSymbol: string) => {
    const stockToTrade = stocks.find(s => s.symbol === stockSymbol);
    if (stockToTrade) {
      setSelectedStock(stockToTrade);
      setTradeDialogOpen(true);
    }
  };
  
  const renderLoadingState = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  const Header = () => (
     <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 font-headline">
          <BrainCircuit className="w-6 h-6 text-primary" /> AI-Powered Insights
        </h2>
        <Button variant="outline" size="sm" onClick={fetchRecommendations} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
        </Button>
      </div>
  )

  return (
    <>
      <div className="space-y-4">
        <Header />
        {loading ? (
            renderLoadingState()
        ) : error ? (
            <Card className="text-center py-8 border-destructive/50">
                <p className="text-destructive">{error}</p>
            </Card>
        ) : recommendations.length === 0 ? (
            <Card className="text-center py-8">
                <p className="text-muted-foreground">No recommendations right now. Check back later!</p>
            </Card>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((rec, index) => {
                const isBuy = rec.action === "BUY";
                return (
                <Card key={index} className="flex flex-col border-2 border-primary/20 hover:border-primary/50 transition-colors shadow-md hover:shadow-primary/10">
                    <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-headline">{rec.stockSymbol}</CardTitle>
                      <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-md ${isBuy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {rec.action}
                      </span>
                    </div>
                     <CardDescription>
                      <Badge variant="secondary">{rec.category}</Badge>
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                        <p className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">AI Rationale (Confidence: {(rec.confidence * 100).toFixed(0)}%)</p>
                        <p className="font-medium text-foreground text-sm">{rec.reason}</p>
                    </CardContent>
                    <div className="p-4 pt-0">
                    <Button className="w-full" variant="default" onClick={() => handleTradeClick(rec.stockSymbol)}>
                        Trade {rec.stockSymbol}
                    </Button>
                    </div>
                </Card>
                );
            })}
            </div>
        )}
      </div>
      {selectedStock && (
         <TradeDialog
            stock={selectedStock}
            isOpen={isTradeDialogOpen}
            onOpenChange={setTradeDialogOpen}
        />
      )}
    </>
  );
}
