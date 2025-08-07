// IMPORTS
// React
import { useState } from 'react';
// Types
import type { Joke } from '../../types';
// Screens
import { SeedPage } from "./seed"
import { Dashboard } from './dashboard';

// TYPES
type LandingPageProps = {
    setAllJokes: React.Dispatch<React.SetStateAction<Joke[]>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<'Landing' | 'Jokes'>>;
};

// COMPONENT 
export const LandingPage = ({ setAllJokes, setCurrentPage }: LandingPageProps) => {

    // States 
    const [currentLandingScreen, setCurrentLandingScreen] = useState<'Seed' | 'Dashboard'>('Seed')

    // Return
    return (
        <main
            id="LandingPage"
            className="w-full h-full flex justify-center items-center">
            {currentLandingScreen === 'Seed' && <SeedPage setCurrentLandingScreen={setCurrentLandingScreen} />}
            {currentLandingScreen === 'Dashboard' && <Dashboard setAllJokes={setAllJokes} setCurrentPage={setCurrentPage} />}
        </main>
    )
}