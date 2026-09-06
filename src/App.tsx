import { Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { ScriptToggle } from './components/ScriptToggle'
import { ThemeToggle } from './components/ThemeToggle'
import { Theory } from './pages/Theory'
import { Glossary } from './pages/Glossary'
import { Flashcards } from './pages/Flashcards'
import { Tickets } from './pages/Tickets'
import { Profile } from './pages/Profile'

export function App() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <span className="top-bar__title">ПДД + Српски</span>
        <div className="top-bar__controls">
          <ScriptToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Theory />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Nav />
    </div>
  )
}
