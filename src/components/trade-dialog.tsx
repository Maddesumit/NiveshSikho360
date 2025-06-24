"use client";

import { useState, useMemo } from "react";
import type { Stock } from "@/data/stocks";
import { useTradeStore } from "@/hooks/use-trade-store";
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

export default function TradeDialog({
  stock,
  isOpen,
  onOpenChange,
}: {
  stock: Stock;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, dispatch, getHolding } = useTradeStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

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
