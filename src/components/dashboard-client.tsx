"use client";

import { useState, useMemo } from "react";
import { StockCard } from "./stock-card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useNiveshStore } from "@/hooks/use-trade-store";

export default function DashboardClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { stocks } = useNiveshStore();

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    return stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stocks]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Market Watch</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for stocks by name or symbol..."
            className="pl-10 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredStocks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No stocks found.</p>
              <p>Try adjusting your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
