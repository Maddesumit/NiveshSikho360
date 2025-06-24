"use client";

import { useState, useEffect } from "react";
import type { Stock } from "@/data/stocks";
import { getNews } from "@/data/news";
import { getTradeForecast, TradeForecastOutput } from "@/ai/flows/trade-forecast-flow";
import { useNiveshStore } from "@/hooks/use-trade-store";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, TrendingDown, TrendingUp } from "lucide-react";

const ForecastDisplay = ({ stock, forecast, loading }: { stock: Stock; forecast: TradeForecastOutput | null; loading: boolean; }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  if (loading) {
    return (
      <div className="space-y-2 mt-4">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
        <h4 className="font-semibold flex items-center gap-2 mb-2">
          <Rocket className="w-4 h-4 text-primary" />
          AI 7-Day Forecast
        </h4>
        <p className="text-muted-foreground italic mb-2">"{forecast.reasoning}"</p>
        <div className="flex justify-between items-center">
            <div className="text-center">
                <p className="font-semibold text-red-600 flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Worst Case</p>
                <p>{formatCurrency(forecast.worstCase)}</p>
            </div>
            <div className="text-center">
                 <p className="font-semibold text-green-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Best Case</p>
                 <p>{formatCurrency(forecast.bestCase)}</p>
            </div>
        </div>
    </div>
  );
};


export default function TradeDialog({
  stock,
  isOpen,
  onOpenChange,
}: {
  stock: Stock;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, dispatch, getHolding } = useNiveshStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [forecast, setForecast] = useState<TradeForecastOutput | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    const fetchForecast = async () => {
        if (!stock) return;
        setLoadingForecast(true);
        setForecast(null);
        try {
            const allNews = getNews();
            const relevantNews = allNews
                .filter(article => article.relatedStocks.includes(stock.symbol))
                .map(article => article.headline);

            const input = {
                stockSymbol: stock.symbol,
                stockName: stock.name,
                currentPrice: stock.price,
                priceHistory: stock.history.map(h => h.price),
                relevantNews: relevantNews,
            };
            const result = await getTradeForecast(input);
            setForecast(result);
        } catch (error) {
            console.error("Failed to fetch trade forecast:", error);
            // Don't show an error to the user, just fail silently.
        } finally {
            setLoadingForecast(false);
        }
    };

    if (isOpen) {
      fetchForecast();
    }
  }, [isOpen, stock]);

  const holding = getHolding(stock.symbol);

  const handleTrade = (type: "BUY" | "SELL") => {
    if (quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Quantity",
        description: "Please enter a quantity greater than zero.",
      });
      return;
    }

    try {
      dispatch({ type, payload: { stock, quantity } });
      toast({
        title: "Trade Successful",
        description: `Successfully ${
          type === "BUY" ? "bought" : "sold"
        } ${quantity} shares of ${stock.symbol}.`,
      });
      onOpenChange(false);
      setQuantity(1);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Trade Failed",
        description: error.message,
      });
    }
  };

  const totalCost = stock.price * quantity;
  const canBuy = state.cash >= totalCost;
  const canSell = (holding?.quantity ?? 0) >= quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Trade {stock.symbol}
          </DialogTitle>
          <DialogDescription>
            {stock.name} - Current Price:{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(stock.price)}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <div className="space-y-4 py-4">
              <p>Available Cash: {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                }).format(state.cash)}</p>
              <div className="space-y-2">
                <Label htmlFor="buy-quantity">Quantity</Label>
                <Input
                  id="buy-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                />
              </div>
              <div className="font-semibold">Total Cost: {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                }).format(totalCost)}</div>
                 <ForecastDisplay stock={stock} forecast={forecast} loading={loadingForecast} />
            </div>
            <DialogFooter>
              <Button
                className="w-full"
                disabled={!canBuy}
                onClick={() => handleTrade("BUY")}
              >
                {canBuy ? "Confirm Buy" : "Not Enough Cash"}
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="sell">
            <div className="space-y-4 py-4">
              <p>Shares Owned: {holding?.quantity ?? 0}</p>
              <div className="space-y-2">
                <Label htmlFor="sell-quantity">Quantity</Label>
                <Input
                  id="sell-quantity"
                  type="number"
                  min="1"
                  max={holding?.quantity ?? 0}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                />
              </div>
              <div className="font-semibold">Total Proceeds: {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                }).format(totalCost)}</div>
                 <ForecastDisplay stock={stock} forecast={forecast} loading={loadingForecast} />
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                className="w-full"
                disabled={!canSell}
                onClick={() => handleTrade("SELL")}
              >
                {canSell ? "Confirm Sell" : "Not Enough Shares"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
