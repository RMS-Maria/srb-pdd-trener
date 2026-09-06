import { useState } from 'react'
import { getRoadSigns } from '../lib/content'
import { SignIcon } from '../components/SignIcon'
import type { SignGroup } from '../types/content'

const GROUP_LABELS: Record<SignGroup, string> = {
  opasnost: 'Знаки опасности',
  prvenstvo: 'Знаки предписания — приоритет',
  zabrana: 'Знаки предписания — запрет',
  obaveza: 'Знаки предписания — обязанность',
  obavestenje: 'Информационные знаки',
}

const GROUP_ORDER: SignGroup[] = ['opasnost', 'prvenstvo', 'zabrana', 'obaveza', 'obavestenje']

export function Signs() {
  const signs = getRoadSigns()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div>
      <div className="callout callout-info">
        ℹ️ Это схематичные учебные отрисовки (форма и цвет соответствуют группе знака), а не
        точное факсимиле из официального приложения к Pravilnik o saobraćajnoj signalizaciji.
        Три официальные группы знаков и подтипы «izričitih naredbi» (приоритет / запрет /
        обязанность) уже проверены по закону — см. раздел «Теория».
      </div>

      {GROUP_ORDER.map((group) => (
        <div key={group}>
          <h3>{GROUP_LABELS[group]}</h3>
          <div className="sign-grid">
            {signs
              .filter((s) => s.group === group)
              .map((sign) => (
                <button
                  key={sign.id}
                  className="sign-card"
                  onClick={() => setOpenId(openId === sign.id ? null : sign.id)}
                >
                  <SignIcon shape={sign.shape} symbol={sign.symbol} />
                  <span className="sign-card__name">{sign.name_ru}</span>
                  {openId === sign.id && (
                    <span className="sign-card__details">
                      <strong>{sign.name_sr}</strong>
                      <br />
                      {sign.explanation}
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
