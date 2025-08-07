// IMPORTS
import { useState, useEffect, useRef } from "react"
// Components
import { Laugh } from 'lucide-react'
import { ChartPieDonutActive } from "@/components/categoriesChart";
// Types
import type { Joke, CategoryCount, ChartDataItem, DashboardApiResponse } from '../../types';

// TYPES
type DashboardPageProps = {
    setAllJokes: React.Dispatch<React.SetStateAction<Joke[]>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<'Landing' | 'Jokes'>>
};

// COMPONENT
export const Dashboard = ({ setAllJokes, setCurrentPage }: DashboardPageProps) => {
    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<CategoryCount[]>([])
    const [readyToStart, setReadyToStart] = useState(false);
    const [showChart, setShowChart] = useState(false); // Control when to mount chart

    // Refs
    const topDivRef = useRef<HTMLDivElement>(null);
    const bottomDivRef = useRef<HTMLDivElement>(null);

    // Helper functions
    // Transform data from API to fit props necessary for pie chart component
    const transformDataForChart = (categories: CategoryCount[]): ChartDataItem[] => {
        if (!categories || !Array.isArray(categories)) return [];
        return categories.map((item) => ({
            browser: item.category,
            visitors: item.count,
            fill: `var(--color-${item.category.toLowerCase().replace(/[^a-z0-9]/g, '')})`
        }));
    };

    // Function to fade in elements
    const fadeIn = () => {
        if (bottomDivRef.current) {
            bottomDivRef.current.style.transition = 'opacity 500ms ease-out';
            bottomDivRef.current.style.opacity = '1'
        }
        setTimeout(() => {
            if (topDivRef.current) {
                topDivRef.current.style.transition = 'opacity 500ms ease-out';
                topDivRef.current.style.opacity = '1'
                setShowChart(true);
            }
        }, 500)
    }

    // Handlers
    const startJokes = async () => {
        // Animate top div
        if (topDivRef.current) {
            topDivRef.current.style.transition = 'opacity 500ms ease-out';
            topDivRef.current.style.opacity = '0';
        }
        // Animate bottom div
        setTimeout(() => {
            if (bottomDivRef.current) {
                bottomDivRef.current.style.transition = 'opacity 500ms ease-out';
                bottomDivRef.current.style.opacity = '0';
            }
        }, 500);
        // Change page when animation complete
        setTimeout(() => {
            setCurrentPage('Jokes')
        }, 1000);
    };

    // Fetch all jokes
    const fetchAllJokes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch
            const response = await fetch('http://localhost:3000/jokes/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Not OK
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            // Response OK
            const data: DashboardApiResponse = await response.json();
            setDashboardData(data.categories)
            setAllJokes(data.jokes)
            setReadyToStart(true);

        } catch (err) {
            console.log(err);
            setError("Load failed. Please make sure the database is seeded first");
        } finally {
            setLoading(false);
        }
    }

    // Fetch all jokes and fade in on mount
    useEffect(() => {
        fadeIn();
        fetchAllJokes();
    }, [])

    // Return
    return (
        <main className="w-full h-full flex flex-col landscape:flex-row">
            <div ref={topDivRef} id="top" className="opacity-0 duration-500 flex flex-grow-1 w-full h-full justify-center items-center">
                <button
                    onClick={startJokes}
                    disabled={loading || !readyToStart}
                    className="cursor-pointer bg-trim rounded text-black flex flex-col items-center justify-center gap-3 p-6 hover:opacity-100 duration-150 animate-pulse hover:animate-none shadow-lg hover:shadow-xl transition-shadow hover:scale-105">
                    <Laugh className="w-10 h-10" />
                    <p className="text-black font-medium">Make me laugh</p>
                </button>
            </div>
            <div ref={bottomDivRef} id="Dashboard" className="opacity-0 duration-500 flex flex-col justify-center items-center flex-grow-1 w-full h-full">
                {showChart && (
                    <ChartPieDonutActive
                        data={transformDataForChart(dashboardData)}
                    />
                )}
                {error && <p className="text-destructive">{error}</p>}
            </div>
        </main>
    )
}