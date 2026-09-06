import { useScript } from '../context/ScriptContext'

export function ScriptToggle() {
  const { script, toggle } = useScript()
  return (
    <button
      className="icon-toggle"
      onClick={toggle}
      title="Переключить письмо: латиница/кириллица"
    >
      {script === 'latin' ? 'Lat' : 'Ćir'}
    </button>
  )
}
