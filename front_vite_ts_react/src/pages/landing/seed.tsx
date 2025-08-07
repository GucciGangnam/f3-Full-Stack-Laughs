// IMPORTS
// React
import { useState, useRef } from 'react';
// Icons
import { Sprout, CircleCheck } from 'lucide-react'

// TYPES
type Pages = 'Seed' | 'Dashboard';
interface SeedPageProps {
    setCurrentLandingScreen: React.Dispatch<React.SetStateAction<Pages>>;
}

// COMPONENT
export const SeedPage = ({ setCurrentLandingScreen }: SeedPageProps) => {
    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Refs 
    const buttonRef = useRef<HTMLButtonElement>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);
    const footingRef = useRef<HTMLDivElement>(null);

    // Fade out funtion
    const fadeOut = () => {
        // Animate button
        if (buttonRef.current) {
            buttonRef.current.style.transition = 'opacity 500ms ease-out';
            buttonRef.current.style.opacity = '0';
        }
        // Animate message
        setTimeout(() => {
            if (messageRef.current) {
                messageRef.current.style.transition = 'opacity 500ms ease-out';
                messageRef.current.style.opacity = '0';
            }
        }, 500);
        // Animate any footers
        setTimeout(() => {
            if (footingRef.current) {
                footingRef.current.style.transition = 'opacity 400ms ease-out';
                footingRef.current.style.opacity = '0';
            }
        }, 600);
        // Chnage screen when complete
        setTimeout(() => {
            setCurrentLandingScreen("Dashboard")
        }, 1000);
    };

    // Handlers
    const seedDatabase = async () => {
        try {
            setLoading(true);
            setError(null);
            //fetch
            const response = await fetch('http://localhost:3000/database/seed', { // Hardcoded
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            //Check response
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            // Respons ok
            setSuccess(true);
            // Run fade out 
            fadeOut();

        } catch (err) {
            console.log(err);
            setError("Load failed. Please make sure the server is runnign on port 3000");
            setLoading(false);
        }
    };

    // Return
    return (
        <main className="text-trim flex flex-col items-center gap-5">

            <button
                ref={buttonRef}
                onClick={seedDatabase}
                disabled={loading}
                className="cursor-pointer w-16 h-16 bg-trim rounded text-black flex items-center justify-center opacity-70 hover:opacity-100 duration-150 hover:scale-105">
                <Sprout className="w-10 h-10" />
            </button>

            <p ref={messageRef}> Click to seed database </p>

            <div ref={footingRef} className="min-h-6">
                {loading && !success && <p className="text-green-500">Seeding database...</p>}
                {success && <CircleCheck />}
                {!loading && error && <p className="text-red-500">{error}</p>}
            </div>
        </main>
    )
}