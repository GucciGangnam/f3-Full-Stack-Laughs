// IMPORTS
// React
import { useEffect, useState, useRef } from "react";
// Types
import type { Joke } from '../../types';
// Icons
import { Heart } from 'lucide-react'
// Componenets
import { JokeCard } from "@/components/jokeCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// TYPES
type JokesPageProps = {
    allJokes: Joke[];
};

// COMPONENT
export const JokesPage = ({ allJokes }: JokesPageProps) => {
    // States
    const [currentJoke, setCurrentJoke] = useState<Joke>();
    const [likedJokes, setLikedJokes] = useState<Joke[]>([]);
    // Refs
    const jokeCardRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Get liked jokes from LS
    const loadLikedJokes = () => {
        const existingLikedJokes = localStorage.getItem('likedJokes');
        const likedJokesArray = existingLikedJokes ? JSON.parse(existingLikedJokes) : [];
        setLikedJokes(likedJokesArray);
    };

    // Function to fade in elements
    const fadeIn = () => {
        if (jokeCardRef.current) {
            jokeCardRef.current.style.opacity = '1';
        }
        if (buttonRef.current) {
            buttonRef.current.style.opacity = '1';
        }
    }

    // Function to select random joke
    const selectRandomJoke = () => {
        const randomJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
        setCurrentJoke(randomJoke);
    }

    // Run selectRandomJoke and fade in on mount
    useEffect(() => {
        selectRandomJoke();
        fadeIn();
    }, [])

    return (
        <main className="w-full h-full flex flex-col gap-5 justify-center items-center">
            {/* Joke card */}
            <div
                ref={jokeCardRef}
                className="opacity-0 duration-500"
            >
                {currentJoke ? (
                    <JokeCard currentJoke={currentJoke} />
                ) : (
                    <div className="text-white">Click "New joke" to get started!</div>
                )}
            </div>

            {/* Next joke button */}
            <button
                ref={buttonRef}
                onClick={selectRandomJoke}
                className="rounded-full p-4 cursor-pointer font-bold opacity-0 duration-300 hover:scale-105"
                style={{
                    backgroundImage: 'url(/btnBG.avif)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backfaceVisibility: 'hidden',
                }}>
                New joke
            </button>

            {/* Liked Jokes Dialog */}
            <div id="dialogContainer" className="bg-red-200 absolute bottom-10 left-10 p-2 rounded-full flex hover:scale-105">
                <Dialog>
                    <DialogTrigger onClick={loadLikedJokes}>
                        <Heart />
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Liked Jokes</DialogTitle>
                            <DialogDescription>
                                Here are the jokes you liked so you can share them with others.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            {/* Map liked jokes */}
                            {likedJokes.length === 0 ? (
                                <div className="flex justify-center gap-2">
                                <p className="text-center text-black">Like a joke on the back of a card to keep it</p>
                                <Heart color="pink"/>
                                </div>
                            ) : (
                                likedJokes.map((joke) => (
                                    <div key={joke.id} className="border rounded-lg p-4 space-y-2">
                                        <div className="text-sm font-semibold text-muted-foreground capitalize">
                                            {joke.type}
                                        </div>
                                        <p className="font-medium">{joke.setup}</p>
                                        <p className="text-muted-foreground italic">{joke.punchline}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    )
}