import { Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { ScriptToggle } from './components/ScriptToggle'
import { ThemeToggle } from './components/ThemeToggle'
import { Theory } from './pages/Theory'
import { Glossary } from './pages/Glossary'
import { Signs } from './pages/Signs'
import { Flashcards } from './pages/Flashcards'
import { Tickets } from './pages/Tickets'
import { Profile } from './pages/Profile'

function sectionForPath(pathname: string): string {
  if (pathname.startsWith('/glossary')) return 'section-glossary'
  if (pathname.startsWith('/signs')) return 'section-signs'
  if (pathname.startsWith('/flashcards')) return 'section-flashcards'
  if (pathname.startsWith('/tickets')) return 'section-tickets'
  if (pathname.startsWith('/profile')) return 'section-profile'
  return 'section-theory'
}

export function App() {
  const location = useLocation()

  return (
    <div className={`app-shell ${sectionForPath(location.pathname)}`}>
      <header className="top-bar">
        <span className="top-bar__title">ПДД + Српски</span>
        <div className="top-bar__controls">
          <ScriptToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="app-body">
        <Nav />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Theory />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/signs" element={<Signs />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
