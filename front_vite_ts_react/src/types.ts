// SINGLE JOKE 
export type Joke = {
    id: number;
    type: string;
    setup: string;
    punchline: string;
    liked?: boolean;
};

// CATEGORY COUNT
export interface CategoryCount {
    category: string;
    count: number;
}

//CHART ITEM
export interface ChartDataItem {
    browser: string;
    visitors: number;
    fill: string;
}

// API RESPONSE - CATEGORIES
export interface DashboardApiResponse {
    categories: CategoryCount[];
    jokes: Joke[];
}