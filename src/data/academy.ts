export type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
};
  
export type AcademyModule = {
    id: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    title: string;
    explanation: string;
    example: string;
    quiz: QuizQuestion[];
};

export type AcademyCourse = {
    id: string;
    title: string;
    description: string;
    modules: AcademyModule[];
    finalQuiz: QuizQuestion[];
}

const courseModules: AcademyModule[] = [
    // Beginner
    {
        id: 'what-is-a-stock',
        level: 'Beginner',
        title: 'What is a Stock?',
        explanation: "A stock, also known as equity, represents a share of ownership in a public company. When you buy a company's stock, you are buying a small piece of that company. If the company does well and its value increases, the price of your stock may go up. If the company performs poorly, the stock price may fall. Owning stock gives you the right to a portion of the company's profits (paid as dividends) and voting rights in shareholder meetings. It's a way for companies to raise money to fund operations or expansion, and for investors to potentially grow their wealth.",
        example: "Imagine a company is a pizza. A stock is like one slice of that pizza. If more people want to buy that pizza (the company is doing well), each slice becomes more valuable. If you own a slice, you can sell it for more than you paid.",
        quiz: [
            {
                question: "What does a stock represent?",
                options: ["A loan to a company", "Ownership in a company", "A company's debt", "A government bond"],
                correctAnswer: "Ownership in a company"
            },
            {
                question: "Why do companies issue stock?",
                options: ["To give away money", "To hire employees", "To raise money for the business", "To pay taxes"],
                correctAnswer: "To raise money for the business"
            }
        ]
    },
    {
        id: 'nse-bse',
        level: 'Beginner',
        title: 'What are NSE & BSE?',
        explanation: "The National Stock Exchange (NSE) and the Bombay Stock Exchange (BSE) are the two primary stock exchanges in India. A stock exchange is a marketplace where stocks, bonds, and other securities are bought and sold. Think of it like a giant, regulated market where buyers and sellers meet. The NSE is known for its electronic trading platform and its benchmark index, the Nifty 50, which tracks the 50 largest and most actively traded stocks. The BSE is Asia's oldest stock exchange, and its benchmark index is the SENSEX, tracking 30 major stocks. Most large Indian companies are listed on both exchanges.",
        example: "If you want to buy a share of Reliance Industries, you don't go to a Reliance office. Instead, you place an order through your broker, and the transaction happens on the NSE or BSE, connecting you with someone who wants to sell their shares.",
        quiz: [
            {
                question: "What is the benchmark index for the NSE?",
                options: ["SENSEX", "Dow Jones", "Nifty 50", "FTSE 100"],
                correctAnswer: "Nifty 50"
            },
            {
                question: "What is the main function of a stock exchange?",
                options: ["To print money", "To provide a marketplace for trading securities", "To directly manage companies", "To set company prices"],
                correctAnswer: "To provide a marketplace for trading securities"
            }
        ]
    },
    // Intermediate
    {
        id: 'market-vs-limit-orders',
        level: 'Intermediate',
        title: 'Market Orders vs. Limit Orders',
        explanation: "A market order is an instruction to buy or sell a stock immediately at the best available current price. Its main advantage is that it's almost guaranteed to be executed quickly. The disadvantage is that the price you get might be slightly different from what you saw, especially in a fast-moving market. A limit order is an instruction to buy or sell a stock at a specific price or better. A buy limit order will only execute at your limit price or lower, and a sell limit order will only execute at your limit price or higher. This gives you control over the price, but there's no guarantee the order will be filled if the stock doesn't reach your target price.",
        example: "Market Order: 'Buy 10 shares of TCS now, whatever the price.' You'll get the shares instantly at the going rate. Limit Order: 'Buy 10 shares of TCS, but only if the price drops to ₹3800 or less.' Your order will wait and only execute if the price hits your target.",
        quiz: [
            {
                question: "Which order type guarantees execution but not the price?",
                options: ["Limit Order", "Stop Order", "Market Order", "Trailing Stop Order"],
                correctAnswer: "Market Order"
            },
            {
                question: "What is the risk of a limit order?",
                options: ["Paying too much", "The order might never be executed", "It executes too quickly", "It has higher fees"],
                correctAnswer: "The order might never be executed"
            }
        ]
    },
    {
        id: 'pe-ratio',
        level: 'Intermediate',
        title: 'Understanding P/E Ratio',
        explanation: "The Price-to-Earnings (P/E) ratio is a popular valuation metric used to see if a stock is overvalued or undervalued. It's calculated by dividing the company's current stock price by its earnings per share (EPS). A high P/E ratio could mean that a stock's price is high relative to its earnings and might be overvalued. It could also indicate that investors expect high future growth. Conversely, a low P/E ratio might indicate that a stock is undervalued, or that the company is facing challenges. It's most useful when comparing companies within the same sector or against the company's own historical P/E.",
        example: "If Stock A is priced at ₹100 and its EPS is ₹10, its P/E is 10 (100/10). If Stock B in the same industry is priced at ₹200 and its EPS is ₹10, its P/E is 20. Stock B is more 'expensive' relative to its earnings than Stock A.",
        quiz: [
            {
                question: "How is the P/E ratio calculated?",
                options: ["Stock Price / Revenue", "Market Cap / Debt", "Stock Price / Earnings Per Share", "Revenue / Net Profit"],
                correctAnswer: "Stock Price / Earnings Per Share"
            },
            {
                question: "A high P/E ratio might suggest...",
                options: ["The company is failing", "The stock is definitely undervalued", "Investors expect future growth", "The company has low debt"],
                correctAnswer: "Investors expect future growth"
            }
        ]
    },
    // Advanced
    {
        id: 'technical-indicators',
        level: 'Advanced',
        title: 'Technical Indicators (RSI, MACD)',
        explanation: "Technical indicators are heuristic or pattern-based signals produced by the price, volume, and/or open interest of a security or contract. The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements, typically on a scale of 0 to 100. RSI is considered overbought when above 70 and oversold when below 30. The Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of a security’s price. A 'buy' signal occurs when the MACD line crosses above the signal line.",
        example: "An analyst might say, 'The stock's RSI just dropped below 30, suggesting it's oversold and could be a buying opportunity.' Or, 'We're seeing a bullish MACD crossover, which could signal the start of an upward trend.'",
        quiz: [
            {
                question: "What does an RSI value above 70 typically indicate?",
                options: ["The stock is oversold", "The stock is overbought", "A neutral trend", "A buy signal"],
                correctAnswer: "The stock is overbought"
            },
            {
                question: "What does the MACD indicator primarily help to identify?",
                options: ["Company earnings", "Market volatility", "Trends and momentum", "Analyst ratings"],
                correctAnswer: "Trends and momentum"
            }
        ]
    },
    {
        id: 'trading-psychology',
        level: 'Advanced',
        title: 'Trading Psychology',
        explanation: "Trading psychology refers to the emotions and mental state that help to dictate success or failure in trading securities. Two of the most significant emotions are fear and greed. Fear can cause a trader to sell a position too early, missing out on potential gains, or avoid entering a trade altogether. Greed can lead to holding a winning position for too long in hopes of an even bigger profit, only to see it turn into a loss. Successful traders learn to manage these emotions, stick to their trading plan, and maintain discipline, treating trading like a business rather than a casino.",
        example: "An investor succumbs to FOMO (Fear Of Missing Out) and buys a stock after it has already risen 50% in a week, which is a decision driven by greed. Another trader panics during a small market dip and sells all their holdings at a loss, driven by fear.",
        quiz: [
            {
                question: "Which two emotions are considered the biggest challenges in trading psychology?",
                options: ["Joy and Sadness", "Hope and Despair", "Fear and Greed", "Confidence and Doubt"],
                correctAnswer: "Fear and Greed"
            },
            {
                question: "What is a key trait of a successful trader?",
                options: ["Taking big risks for big rewards", "Following hot tips", "Always being in the market", "Maintaining discipline and a trading plan"],
                correctAnswer: "Maintaining discipline and a trading plan"
            }
        ]
    }
];

export const courseData: AcademyCourse = {
    id: 'stock-market-101',
    title: 'Learn Stock Market from Beginner to Advance',
    description: 'A comprehensive course designed to take you from the very basics of stock investing to advanced concepts. Learn at your own pace with bite-sized modules, interactive quizzes, and practical examples.',
    modules: courseModules,
    finalQuiz: [
        // Sample questions from each module
        {
            question: "What does a stock represent?",
            options: ["A loan to a company", "Ownership in a company", "A company's debt", "A government bond"],
            correctAnswer: "Ownership in a company"
        },
        {
            question: "What is the benchmark index for the NSE?",
            options: ["SENSEX", "Dow Jones", "Nifty 50", "FTSE 100"],
            correctAnswer: "Nifty 50"
        },
        {
            question: "Which order type guarantees execution but not the price?",
            options: ["Limit Order", "Stop Order", "Market Order", "Trailing Stop Order"],
            correctAnswer: "Market Order"
        },
        {
            question: "How is the P/E ratio calculated?",
            options: ["Stock Price / Revenue", "Market Cap / Debt", "Stock Price / Earnings Per Share", "Revenue / Net Profit"],
            correctAnswer: "Stock Price / Earnings Per Share"
        },
        {
            question: "What does an RSI value above 70 typically indicate?",
            options: ["The stock is oversold", "The stock is overbought", "A neutral trend", "A buy signal"],
            correctAnswer: "The stock is overbought"
        },
        {
            question: "Which two emotions are considered the biggest challenges in trading psychology?",
            options: ["Joy and Sadness", "Hope and Despair", "Fear and Greed", "Confidence and Doubt"],
            correctAnswer: "Fear and Greed"
        }
    ]
};


export const getCourse = (): AcademyCourse => {
    return courseData;
};

export const getModules = (): AcademyModule[] => {
    return courseData.modules;
}

export const getModuleById = (id: string): AcademyModule | undefined => {
    return courseData.modules.find(m => m.id === id);
};
