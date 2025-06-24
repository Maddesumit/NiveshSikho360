export type NewsArticle = {
    id: number;
    headline: string;
    summary: string;
    relatedStocks: string[];
    source: string;
    timestamp: string;
};

const newsData: NewsArticle[] = [
    {
        id: 1,
        headline: "TCS reports strong Q2 earnings, beating analyst expectations with record-high deal wins.",
        summary: "Tata Consultancy Services (TCS) announced a significant rise in its quarterly net profit, driven by a surge in digital transformation deals across North America and Europe. The company's order book has reached an all-time high.",
        relatedStocks: ["TCS", "INFY", "WIPRO"],
        source: "Business Standard",
        timestamp: "2h ago"
    },
    {
        id: 2,
        headline: "Auto sector faces headwinds as chip shortage continues to impact production schedules.",
        summary: "Major automobile manufacturers, including Maruti Suzuki and Tata Motors, are reporting production cuts due to the ongoing global semiconductor shortage. This is expected to impact sales volumes for the upcoming festive season.",
        relatedStocks: ["MARUTI", "TATAMOTORS", "M_M"],
        source: "Livemint",
        timestamp: "5h ago"
    },
    {
        id: 3,
        headline: "Government announces new Production-Linked Incentive (PLI) scheme for the pharma sector.",
        summary: "The Indian government has approved a new PLI scheme aimed at boosting domestic manufacturing of key pharmaceutical ingredients and drugs. This move is expected to reduce reliance on imports and benefit companies like Sun Pharma and Cipla.",
        relatedStocks: ["SUNPHARMA", "DRREDDY", "CIPLA"],
        source: "The Economic Times",
        timestamp: "1d ago"
    },
    {
        id: 4,
        headline: "Reliance Industries to invest ₹75,000 crore in new green energy projects.",
        summary: "Reliance Industries Ltd (RIL) has unveiled an ambitious plan to invest heavily in renewable energy, including solar and hydrogen power. The move is seen as a major step in the company's pivot towards sustainable energy.",
        relatedStocks: ["RELIANCE", "SUZLON", "NTPC"],
        source: "Reuters",
        timestamp: "1d ago"
    },
    {
        id: 5,
        headline: "Banking sector credit growth remains steady, but analysts watch for rising interest rates.",
        summary: "Major banks like HDFC Bank and ICICI Bank continue to show stable credit growth. However, with the central bank hinting at potential interest rate hikes to curb inflation, net interest margins could be a key factor to watch.",
        relatedStocks: ["HDFCBANK", "ICICIBANK", "SBIN"],
        source: "Moneycontrol",
        timestamp: "2d ago"
    }
];

export const getNews = (): NewsArticle[] => {
  return newsData;
};
