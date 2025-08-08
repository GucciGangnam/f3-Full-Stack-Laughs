"use client"
import { Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with an active sector"

// Default data for fallback
const defaultChartData = [
    { browser: "general", visitors: 380, fill: "var(--color-general)" },
    { browser: "programming", visitors: 64, fill: "var(--color-programming)" },
    { browser: "knock-knock", visitors: 5, fill: "var(--color-knockknock)" },
    { browser: "dad", visitors: 2, fill: "var(--color-dad)" },
]


const chartConfig = {
    // Add your joke categories
    general: {
        label: "General",
        color: "var(--chart-1)",
    },
    programming: {
        label: "Programming",
        color: "var(--chart-3)",
    },
    knockknock: {
        label: "Knock Knock",
        color: "var(--chart-4)",
    },
    dad: {
        label: "Dad",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

// Add interface for props
interface ChartPieDonutActiveProps {
    data?: Array<{
        browser: string;
        visitors: number;
        fill: string;
    }>;
}

export function ChartPieDonutActive({ data }: ChartPieDonutActiveProps) {
    // Use passed data or fall back to default
    const chartData = data && data.length > 0 ? data : defaultChartData;

    return (
        <Card className="flex flex-col bg-inherit border-0 h-[400px] shadow-none">
            <CardHeader className="items-center pb-0 flex-shrink-0 text-trim text-center font-bold">
                Joke Database
            </CardHeader>
            <CardContent className="flex-1 pb-0 min-h-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] min-h-[200px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={0}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }: PieSectorDataItem) => (
                                <Sector {...props} outerRadius={outerRadius + 10} />
                            )}


                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm flex-shrink-0 h-20">
                {chartData.map((item) => (
                    <div key={item.browser} className="w-full flex items-center justify-between leading-none font-medium text-white">
                        <span>{item.browser.charAt(0).toUpperCase() + item.browser.slice(1).replace('-', ' ')}</span>
                        <span>{item.visitors} jokes</span>
                    </div>
                ))}
            </CardFooter>
        </Card>
    )
}