// IMPORTS
import { useState, useEffect } from 'react';
// Types
import type { Joke } from '../types';
// Icons
import { Heart } from 'lucide-react'

// TYPES
type JokesCardProps = {
    currentJoke: Joke;
};

// COMPONENT
export const JokeCard = ({ currentJoke }: JokesCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // UE to check if joke is liked when current joke change
    useEffect(() => {
        const existingLikedJokes = localStorage.getItem('likedJokes');
        const likedJokesArray = existingLikedJokes ? JSON.parse(existingLikedJokes) : [];
        const jokeIsLiked = likedJokesArray.some((joke: Joke) => joke.id === currentJoke.id);
        setIsLiked(jokeIsLiked);
    }, [currentJoke]);

    // Handlers
    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Stop card flip

        // Get jokes from localStorage
        const existingLikedJokes = localStorage.getItem('likedJokes');
        const likedJokesArray = existingLikedJokes ? JSON.parse(existingLikedJokes) : [];

        const jokeExists = likedJokesArray.some((joke: Joke) => joke.id === currentJoke.id);

        if (jokeExists) {
            // Unlike
            const updatedArray = likedJokesArray.filter((joke: Joke) => joke.id !== currentJoke.id);
            localStorage.setItem('likedJokes', JSON.stringify(updatedArray));
            setIsLiked(false);
        } else {
            // Like
            const likedJoke = { ...currentJoke, liked: true };
            likedJokesArray.push(likedJoke);
            localStorage.setItem('likedJokes', JSON.stringify(likedJokesArray));
            setIsLiked(true);
        }
    };

    // UE to flip card back on change
    useEffect(() => {
        setIsFlipped(false);
    }, [currentJoke]);

    // Function to get responsive text size based on text length
    const getTextSize = (text: string) => {
        const length = text.length;

        if (length < 50) return 'text-4xl';
        if (length < 80) return 'text-3xl';
        if (length < 120) return 'text-2xl';
        if (length < 160) return 'text-xl';
        return 'text-lg';
    };

    return (
        <div
            className="relative h-100 w-75 cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={handleCardClick}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 transform-gpu ${isFlipped ? 'rotate-y-180' : ''
                    }`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 border-2 rounded-3xl border-trim flex justify-between items-center text-white flex-col backface-hidden overflow-hidden"
                    style={{
                        backgroundImage: 'url(/cardBG.avif)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <div className="w-full p-2 text-trim font-semibold">
                        {currentJoke.type.charAt(0).toUpperCase() + currentJoke.type.slice(1)}
                    </div>

                    {/* Text */}
                    <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden w-full">
                        <p
                            className={`text-trim font-bold text-center leading-tight ${getTextSize(currentJoke.setup)}`}
                            style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto'
                            }}
                        >
                            {currentJoke.setup}
                        </p>
                    </div>

                    <div className="text-muted-foreground animate-pulse p-2 text-sm">
                        Click card to reveal punchline
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 border-2 rounded-3xl border-trim flex justify-center items-center text-white flex-col backface-hidden overflow-hidden"
                    style={{
                        backgroundImage: 'url(/cardBG.avif)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="w-full p-2 text-white font-semibold flex justify-between">
                        {currentJoke.type.charAt(0).toUpperCase() + currentJoke.type.slice(1)}
                        <button className='cursor-pointer' onClick={handleHeartClick}>
                            <Heart color='pink' fill={isLiked ? 'pink' : ''}/>
                        </button>
                    </div>

                    {/* Text */}
                    <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden w-full">
                        <p
                            className={`text-white font-bold text-center leading-tight ${getTextSize(currentJoke.punchline)}`}
                            style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto'
                            }}
                        >
                            {currentJoke.punchline}
                        </p>
                    </div>

                    <div className="text-muted-foreground animate-pulse p-2 text-sm">
                        Click card to go back
                    </div>
                </div>
            </div>
        </div>
    );
};