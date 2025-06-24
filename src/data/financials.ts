export type QuarterlyReport = {
    period: string; // e.g., "Q1 2024"
    revenue: number;
    netProfit: number;
    debt: number;
};

export type YearlyReport = {
    period: string; // e.g., "2024"
    revenue: number;
    netProfit: number;
    debt: number;
};

export type FinancialData = {
    symbol: string;
    quarterly: QuarterlyReport[];
    yearly: YearlyReport[];
};

const generateFinancials = (symbol: string, baseRevenue: number): FinancialData => {
    const quarterly: QuarterlyReport[] = [];
    const yearly: YearlyReport[] = [];
    
    let currentYearlyRevenue = baseRevenue * (0.8 + Math.random() * 0.4); // Start with some variance
    let currentDebt = baseRevenue * (0.2 + Math.random() * 0.6);

    for (let year = 0; year < 5; year++) {
        const currentYear = new Date().getFullYear() - year;
        
        // Yearly data
        const yearlyProfitMargin = (0.05 + Math.random() * 0.15); // 5% to 20% margin
        const yearlyNetProfit = Math.floor(currentYearlyRevenue * yearlyProfitMargin);
        yearly.unshift({
            period: `${currentYear}`,
            revenue: Math.floor(currentYearlyRevenue),
            netProfit: yearlyNetProfit,
            debt: Math.floor(currentDebt)
        });

        // Quarterly data for the current year
        let yearRevenueTracker = 0;
        let yearProfitTracker = 0;
        for (let quarter = 4; quarter > 0; quarter--) {
            // Fluctuate quarterly results around the yearly average
            const seasonalFactor = 1 + (Math.random() - 0.5) * 0.2; // +/- 10% seasonal variance
            let quarterlyRevenue = (currentYearlyRevenue / 4) * seasonalFactor;
            
            // Ensure last quarter makes up the total
            if (quarter === 1) {
                quarterlyRevenue = currentYearlyRevenue - yearRevenueTracker;
            }

            const quarterlyProfitMargin = yearlyProfitMargin * (0.9 + Math.random() * 0.2);
            let quarterlyNetProfit = quarterlyRevenue * quarterlyProfitMargin;
            
            if (quarter === 1) {
                quarterlyNetProfit = yearlyNetProfit - yearProfitTracker;
            }

            quarterly.unshift({
                period: `Q${quarter} ${currentYear}`,
                revenue: Math.floor(quarterlyRevenue),
                netProfit: Math.floor(quarterlyNetProfit),
                debt: Math.floor(currentDebt * (0.98 + Math.random() * 0.04)) // Slight debt fluctuation
            });

            yearRevenueTracker += quarterlyRevenue;
            yearProfitTracker += quarterlyNetProfit;
        }

        // Project backwards for previous year's data
        currentYearlyRevenue *= (0.85 + Math.random() * 0.2); // 85% to 105% of previous year
        currentDebt *= (0.9 + Math.random() * 0.2);
    }


    return {
        symbol,
        quarterly: quarterly.slice(-20), // last 20 quarters
        yearly,
    };
};

const financialDataStore: { [key: string]: FinancialData } = {};

const baseRevenues: { [key: string]: number } = {
    "RELIANCE": 800000, "TCS": 200000, "HDFCBANK": 150000, "INFY": 180000, "ICICIBANK": 130000,
    "HINDUNILVR": 50000, "SBIN": 400000, "BHARTIARTL": 120000, "LT": 160000, "KOTAKBANK": 60000,
    "ITC": 65000, "BAJFINANCE": 40000, "MARUTI": 90000, "TATAMOTORS": 300000, "SUNPHARMA": 45000,
    "DRREDDY": 25000, "WIPRO": 90000, "HCLTECH": 100000, "NESTLEIND": 15000, "TATASTEEL": 250000,
    "JSWSTEEL": 150000, "NTPC": 130000, "ADANIENT": 100000, "ADANIPORTS": 20000, "ULTRACEMCO": 50000,
    "ASIANPAINT": 30000, "AXISBANK": 95000, "BAJAJFINSV": 70000, "M_M": 100000, "TITAN": 35000,
    "POWERGRID": 40000, "ONGC": 500000, "BAJAJ-AUTO": 38000, "INDUSINDBK": 45000, "HINDALCO": 190000,
    "CIPLA": 23000, "COALINDIA": 110000, "EICHERMOT": 14000, "TATACONSUM": 13000, "SBILIFE": 80000,
    "DMART": 45000, "PIDILITIND": 10000, "HAVELLS": 18000, "ZOMATO": 5000, "IRCTC": 3000,
    "IEX": 600, "TRIDENT": 7000, "SUZLON": 6000, "RVNL": 20000, "YESBANK": 25000, "IDEA": 40000
};


export const getFinancials = (symbol: string): FinancialData => {
    if (!financialDataStore[symbol]) {
        const baseRevenue = baseRevenues[symbol] || 5000 + Math.random() * 50000;
        financialDataStore[symbol] = generateFinancials(symbol, baseRevenue);
    }
    return financialDataStore[symbol];
};
