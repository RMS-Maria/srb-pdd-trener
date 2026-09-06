import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Script = 'latin' | 'cyrillic'

const STORAGE_KEY = 'srb-script-pref'

interface ScriptContextValue {
  script: Script
  setScript: (s: Script) => void
  toggle: () => void
}

const ScriptContext = createContext<ScriptContextValue | null>(null)

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScript] = useState<Script>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'cyrillic' ? 'cyrillic' : 'latin'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, script)
  }, [script])

  const toggle = () => setScript((s) => (s === 'latin' ? 'cyrillic' : 'latin'))

  return (
    <ScriptContext.Provider value={{ script, setScript, toggle }}>
      {children}
    </ScriptContext.Provider>
  )
}

export function useScript() {
  const ctx = useContext(ScriptContext)
  if (!ctx) throw new Error('useScript must be used within ScriptProvider')
  return ctx
}

/** Достаёт нужную форму слова из карточки/термина в зависимости от выбранного письма. */
export function pickScript(script: Script, latin: string, cyrillic: string): string {
  return script === 'latin' ? latin : cyrillic
}
