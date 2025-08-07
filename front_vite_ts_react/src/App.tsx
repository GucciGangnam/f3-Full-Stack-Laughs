// IMPORTS 
// React
import { useState } from 'react';
//Components
import { Header } from './components/header';
import { LandingPage } from './pages/landing';
import { JokesPage } from './pages/jokes';
// Types
import type { Joke } from './types';


// COMPONENT
function App() {

  // States
  const [allJokes, setAllJokes] = useState<Joke[]>([]);
  const [currentPage, setCurrentPage] = useState<'Landing' | 'Jokes'>('Landing')

  // Return
  return (
    <div
      id='App'
      className=' w-screen h-screen max-w-screen max-h-[100dvh] overflow-hidden flex flex-col items-center'
      style={{
        background: 'linear-gradient(to right, #1f1f1f, #3a3a3a)',
      }}>
      <Header setCurrentPage={setCurrentPage} />
      {currentPage === 'Landing' && <LandingPage setAllJokes={setAllJokes} setCurrentPage={setCurrentPage} />}
      {currentPage === 'Jokes' && <JokesPage allJokes={allJokes} />}
    </div>
  )
}

export default App
