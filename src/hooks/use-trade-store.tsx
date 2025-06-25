
"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useState, useEffect } from "react";
import type { Stock } from "@/data/stocks";
import { getStocks, getStockBySymbol, pseudoRandomGenerator } from "@/data/stocks";
import { useAuth } from "./use-auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Order type
export type Order = {
  id: string;
  stock: Stock;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: string;
};

// The state used within the application, with full Stock objects for convenience
type Holding = {
  stock: Stock;
  quantity: number;
  avgPrice: number;
};

type NiveshState = {
  cash: number;
  holdings: Holding[];
  orders: Order[];
  completedModules: string[];
  courseCompleted: boolean;
};

// The format of data as it is stored in Firestore
type StoredHolding = {
  stockSymbol: string;
  quantity: number;
  avgPrice: number;
}

type StoredOrder = {
  id: string;
  stockSymbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: string;
}

type StoredNiveshState = {
  userId: string;
  cash: number;
  holdings: StoredHolding[];
  orders: StoredOrder[];
  completedModules: string[];
  courseCompleted: boolean;
}

type Action =
  | { type: "BUY"; payload: { stock: Stock; quantity: number } }
  | { type: "SELL"; payload: { stock: Stock; quantity: number } }
  | { type: "COMPLETE_MODULE"; payload: string }
  | { type: "COMPLETE_COURSE" }
  | { type: "SET_STATE_FROM_DB"; payload: NiveshState };

const initialState: NiveshState = {
  cash: 100000,
  holdings: [],
  orders: [],
  completedModules: [],
  courseCompleted: false,
};


const niveshReducer = (state: NiveshState, action: Action): NiveshState => {
  switch (action.type) {
    case "SET_STATE_FROM_DB":
      return action.payload;
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
      
      const newOrder: Order = {
        id: new Date().getTime().toString(),
        stock,
        quantity,
        price: stock.price,
        type: 'BUY',
        timestamp: new Date().toISOString(),
      };

      return {
        ...state,
        cash: state.cash - cost,
        holdings: newHoldings,
        orders: [newOrder, ...state.orders],
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

      const newOrder: Order = {
        id: new Date().getTime().toString(),
        stock,
        quantity,
        price: stock.price,
        type: 'SELL',
        timestamp: new Date().toISOString(),
      };

      return {
        ...state,
        cash: state.cash + proceeds,
        holdings: newHoldings,
        orders: [newOrder, ...state.orders]
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
  const { user, loading: authLoading } = useAuth();
  const [state, dispatch] = useReducer(niveshReducer, initialState);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [priceGenerators, setPriceGenerators] = useState<(() => number)[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Defer heavy stock data generation to the client side
  useEffect(() => {
    const allStocks = getStocks();
    setStocks(allStocks);
    setPriceGenerators(allStocks.map(stock => pseudoRandomGenerator(stock.symbol + 'pricefeed')));
  }, []);

  // Effect to load data from Firestore
  useEffect(() => {
    if (authLoading || !db) {
        if(!db && !authLoading) setIsDataLoaded(true);
        return;
    };

    const loadData = async () => {
      if (!user) {
        dispatch({ type: "SET_STATE_FROM_DB", payload: initialState });
        setIsDataLoaded(true);
        return;
      }
      
      const docRef = doc(db, "userPortfolios", user.uid);
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dbState = docSnap.data() as StoredNiveshState;
          const holdings = (dbState.holdings || []).map(h => {
              const stock = getStockBySymbol(h.stockSymbol);
              return stock ? { ...h, stock } : null
          }).filter((h): h is Holding => h !== null);

          const orders = (dbState.orders || []).map(o => {
            const stock = getStockBySymbol(o.stockSymbol);
            return stock ? { ...o, stock } : null
          }).filter((o): o is Order => o !== null);
          
          dispatch({ type: "SET_STATE_FROM_DB", payload: { ...dbState, holdings, orders } });
        } else {
          // New user, set initial state in DB
          await setDoc(docRef, { ...initialState, userId: user.uid, orders: [] });
          dispatch({ type: "SET_STATE_FROM_DB", payload: initialState });
        }
      } catch (error) {
        console.error("Failed to load user data from Firestore:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };
    
    loadData();
  }, [user, authLoading]);

  // Effect to save state changes to Firestore
  useEffect(() => {
    // Debounce saving to avoid too many writes
    const handler = setTimeout(async () => {
      if (!authLoading && user && isDataLoaded && state !== initialState && db) {
        const stateToStore = {
          ...state,
          userId: user.uid,
          holdings: state.holdings.map(h => ({
            stockSymbol: h.stock.symbol,
            quantity: h.quantity,
            avgPrice: h.avgPrice,
          })),
          orders: state.orders.map(o => ({
            id: o.id,
            stockSymbol: o.stock.symbol,
            type: o.type,
            quantity: o.quantity,
            price: o.price,
            timestamp: o.timestamp,
          }))
        };
        try {
            const docRef = doc(db, "userPortfolios", user.uid);
            await setDoc(docRef, stateToStore, { merge: true });
        } catch (error) {
          console.error("Failed to save user data to Firestore:", error);
        }
      }
    }, 1000); // Save 1 second after the last change

    return () => {
      clearTimeout(handler);
    };
  }, [state, user, authLoading, isDataLoaded]);

  // Effect for live price updates
  useEffect(() => {
    if (stocks.length === 0 || priceGenerators.length === 0) return;

    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map((stock, index) => {
          const rand = priceGenerators[index];
          if (!rand) return stock;
          
          const changePercent = (rand() - 0.5) * 0.01;
          const newPrice = Math.max(0.01, stock.price * (1 + changePercent));
          
          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: newPrice - stock.close,
            changePercent: ((newPrice - stock.close) / stock.close) * 100,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [stocks.length, priceGenerators]);

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
