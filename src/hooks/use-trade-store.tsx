"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useState, useEffect } from "react";
import type { Stock } from "@/data/stocks";
import { getStocks, getStockBySymbol } from "@/data/stocks";

type Holding = {
  stock: Stock;
  quantity: number;
  avgPrice: number;
};

type NiveshState = {
  cash: number;
  holdings: Holding[];
  completedModules: string[];
  courseCompleted: boolean;
};

type Action =
  | { type: "BUY"; payload: { stock: Stock; quantity: number } }
  | { type: "SELL"; payload: { stock: Stock; quantity: number } }
  | { type: "COMPLETE_MODULE"; payload: string }
  | { type: "COMPLETE_COURSE" };

const initialState: NiveshState = {
  cash: 100000,
  holdings: [],
  completedModules: [],
  courseCompleted: false,
};

const niveshReducer = (state: NiveshState, action: Action): NiveshState => {
  switch (action.type) {
    case "BUY": {
      const { stock, quantity } = action.payload;
      const cost = stock.price * quantity;

      if (state.cash < cost) {
        throw new Error("Not enough cash to complete this transaction.");
      }

      const existingHoldingIndex = state.holdings.findIndex(
        (h) => h.stock.symbol === stock.symbol
      );
      const newHoldings = [...state.holdings];

      if (existingHoldingIndex > -1) {
        const existingHolding = newHoldings[existingHoldingIndex];
        const newTotalQuantity = existingHolding.quantity + quantity;
        const newAvgPrice =
          (existingHolding.avgPrice * existingHolding.quantity + cost) /
          newTotalQuantity;

        newHoldings[existingHoldingIndex] = {
          ...existingHolding,
          quantity: newTotalQuantity,
          avgPrice: newAvgPrice,
        };
      } else {
        newHoldings.push({
          stock,
          quantity,
          avgPrice: stock.price,
        });
      }

      return {
        ...state,
        cash: state.cash - cost,
        holdings: newHoldings,
      };
    }
    case "SELL": {
      const { stock, quantity } = action.payload;
      const proceeds = stock.price * quantity;

      const existingHoldingIndex = state.holdings.findIndex(
        (h) => h.stock.symbol === stock.symbol
      );

      if (existingHoldingIndex === -1) {
        throw new Error("You do not own any shares of this stock.");
      }

      const existingHolding = state.holdings[existingHoldingIndex];
      if (existingHolding.quantity < quantity) {
        throw new Error("Not enough shares to sell.");
      }
      
      const newHoldings = [...state.holdings];
      if (existingHolding.quantity === quantity) {
        newHoldings.splice(existingHoldingIndex, 1);
      } else {
        newHoldings[existingHoldingIndex] = {
            ...existingHolding,
            quantity: existingHolding.quantity - quantity,
        };
      }

      return {
        ...state,
        cash: state.cash + proceeds,
        holdings: newHoldings
      };
    }
    case "COMPLETE_MODULE": {
        if (state.completedModules.includes(action.payload)) {
            return state;
        }
        return {
            ...state,
            completedModules: [...state.completedModules, action.payload],
        };
    }
    case "COMPLETE_COURSE": {
        if (state.courseCompleted) {
            return state;
        }
        return {
            ...state,
            courseCompleted: true,
            cash: state.cash + 10000,
        };
    }
    default:
      return state;
  }
};

type NiveshContextType = {
  state: NiveshState;
  dispatch: (action: Action) => void;
  getHolding: (symbol: string) => Holding | undefined;
  getStockPrice: (symbol: string) => number;
  stocks: Stock[];
  getStock: (symbol: string) => Stock | undefined;
};

const NiveshContext = createContext<NiveshContextType | undefined>(undefined);

export const NiveshProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(niveshReducer, initialState);
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    // Client-side only initialization
    setStocks(getStocks());
  }, []);

  useEffect(() => {
    if (stocks.length === 0) return; // Don't start interval if there are no stocks

    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const changePercent = (Math.random() - 0.5) * 0.01; // Fluctuate by +/- 0.5%
          const newPrice = Math.max(0.01, stock.price * (1 + changePercent));
          
          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: newPrice - stock.close,
            changePercent: ((newPrice - stock.close) / stock.close) * 100,
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [stocks.length]);

  const executeTrade = useCallback((action: Action) => {
    if (action.type === 'BUY' || action.type === 'SELL') {
      const latestStock = stocks.find(s => s.symbol === action.payload.stock.symbol);
      if (latestStock) {
        dispatch({ ...action, payload: { ...action.payload, stock: latestStock } });
      } else {
          const initialStock = getStockBySymbol(action.payload.stock.symbol);
           if (initialStock) {
              dispatch({ ...action, payload: { ...action.payload, stock: initialStock } });
           } else {
              console.error("Could not find latest stock data for trade.");
           }
      }
    } else {
      dispatch(action);
    }
  }, [stocks]);

  const getHolding = useCallback((symbol: string) => {
    return state.holdings.find(h => h.stock.symbol === symbol);
  }, [state.holdings]);

  const getStockPrice = useCallback((symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    return stock?.price ?? getStockBySymbol(symbol)?.price ?? 0;
  }, [stocks]);

  const getStock = useCallback((symbol: string) => {
    const liveStock = stocks.find(s => s.symbol === symbol);
    return liveStock ?? getStockBySymbol(symbol);
  }, [stocks]);

  return (
    <NiveshContext.Provider value={{ state, dispatch: executeTrade, getHolding, getStockPrice, stocks, getStock }}>
      {children}
    </NiveshContext.Provider>
  );
};

export const useNiveshStore = () => {
  const context = useContext(NiveshContext);
  if (context === undefined) {
    throw new Error("useNiveshStore must be used within a NiveshProvider");
  }
  return context;
};
