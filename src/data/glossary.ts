export type GlossaryTerm = {
  term: string;
  definition: string;
  example: string;
  featured: boolean;
};

export const glossaryData: GlossaryTerm[] = [
    // Featured Terms
    {
        term: 'IPO (Initial Public Offering)',
        definition: 'The process by which a private company becomes a publicly traded company by offering its shares to the public for the first time.',
        example: 'When Zomato first listed on the stock exchange in 2021, it went through an IPO to raise funds from the public.',
        featured: true,
    },
    {
        term: 'Bull Market',
        definition: 'A market condition where stock prices are rising or are expected to rise. It is characterized by optimism, investor confidence, and expectations of strong results.',
        example: 'The period after the 2020 crash was a strong bull market, with many stocks reaching all-time highs.',
        featured: true,
    },
    {
        term: 'Bear Market',
        definition: 'A market condition where stock prices are falling, and widespread pessimism causes the negative sentiment to be self-sustaining.',
        example: 'The financial crisis of 2008 triggered a major bear market, with the SENSEX falling over 50%.',
        featured: true,
    },
    {
        term: 'Limit Order',
        definition: 'An order to buy or sell a stock at a specific price or better. A buy limit order can only be executed at the limit price or lower, and a sell limit order can only be executed at the limit price or higher.',
        example: 'You place a limit order to buy Reliance at ₹2800. The order will only execute if the price of Reliance drops to ₹2800 or less.',
        featured: true,
    },
    {
        term: 'Market Order',
        definition: 'An order to buy or sell a stock immediately at the best available current price. It guarantees execution but not a specific price.',
        example: 'If you place a market order to buy TCS, you will get the shares instantly, but the price might be slightly different from what you saw on the screen.',
        featured: false,
    },
    {
        term: 'Blue-Chip Stocks',
        definition: 'Stocks of large, well-established, and financially sound companies that have operated for many years and have a reputation for quality and reliability.',
        example: 'Companies like HDFC Bank, Hindustan Unilever, and TCS are considered blue-chip stocks in India.',
        featured: false,
    },
    {
        term: 'Dividend',
        definition: 'A distribution of a portion of a company\'s earnings, decided by the board of directors, to a class of its shareholders.',
        example: 'Infosys declared a dividend of ₹18 per share, so if you own 100 shares, you will receive ₹1800.',
        featured: false,
    },
    {
        term: 'P/E Ratio (Price-to-Earnings Ratio)',
        definition: 'A valuation ratio of a company\'s current share price compared to its per-share earnings. It is used to gauge if a stock is overvalued or undervalued.',
        example: 'A company with a stock price of ₹100 and earnings per share of ₹10 has a P/E ratio of 10.',
        featured: false,
    },
    {
        term: 'Volatility',
        definition: 'A statistical measure of the dispersion of returns for a given security or market index. In simple terms, it refers to the amount of uncertainty or risk about the size of changes in a security\'s value.',
        example: 'Small-cap stocks often have higher volatility than large-cap stocks, meaning their prices can swing up and down more dramatically.',
        featured: false,
    },
    {
        term: 'Portfolio',
        definition: 'A collection of financial investments like stocks, bonds, commodities, cash, and cash equivalents, held by an investor.',
        example: 'An investor\'s portfolio might include stocks in various sectors like IT and Banking, some government bonds, and cash.',
        featured: false,
    },
    {
        term: 'Sector',
        definition: 'A group of stocks that have a lot in common because they are in similar industries.',
        example: 'TCS, Infosys, and Wipro all belong to the Information Technology (IT) sector.',
        featured: false,
    },
    {
        term: '52-Week High/Low',
        definition: 'The highest and lowest price at which a stock has traded during the previous 52 weeks (one year).',
        example: 'Traders often watch if a stock is approaching its 52-week high as it could signal a potential breakout.',
        featured: false,
    }
];

export const getGlossaryTerms = (): GlossaryTerm[] => {
    return glossaryData.sort((a, b) => a.term.localeCompare(b.term));
};

export const getFeaturedTerms = (): GlossaryTerm[] => {
    return glossaryData.filter(t => t.featured);
};
