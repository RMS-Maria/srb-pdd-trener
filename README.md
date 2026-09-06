# ПДД + Српски — тренажёр (категория B, Сербия)

Тренажёр для подготовки к теоретическому/практическому экзамену ПДД в Сербии, совмещённый с изучением сербского языка через терминологию.

Phase 1 (MVP): теория (2-3 темы), словарь (Tier 0-2), флэшкарты с упрощённым SM-2, вход по email-ссылке и хранение прогресса в Supabase, переключатель латиница/кириллица, светлая/тёмная тема.

## Локальный запуск

Нужен установленный [Node.js](https://nodejs.org) (LTS).

```bash
npm install
cp .env.local.example .env.local   # заполните значениями из вашего Supabase-проекта
npm run dev
```

## Supabase

1. Создайте бесплатный проект на [supabase.com](https://supabase.com).
2. В `SQL Editor` выполните [`supabase/schema.sql`](supabase/schema.sql) — создаст таблицу `card_progress` с RLS.
3. В `Project Settings -> API` возьмите `Project URL` и `anon public` ключ, впишите в `.env.local`.
4. Без Supabase-настройки сайт всё равно работает: доступны Теория и Словарь, но прогресс по карточкам не сохраняется между сессиями.

## Контент

Весь учебный контент лежит в `/content` отдельно от кода UI:

- `content/theory/*.json` — конспекты тем.
- `content/glossary/*.json` — карточки словаря по tier (`frequency`, `mandatory`, `trap`, …).

Схема карточки описана в `src/types/content.ts`.

## Деплой

При пуше в `main` GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) собирает проект и публикует на GitHub Pages. Нужно:

1. В настройках репозитория `Settings -> Pages -> Source` выбрать "GitHub Actions".
2. В `Settings -> Secrets and variables -> Actions` добавить секреты `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
3. Если репозиторий назван не `srb-pdd-trener`, поправьте `base` в `vite.config.ts`.

## Этапы

- **Phase 1 (готово)** — теория, словарь, флэшкарты, Supabase, тема, письмо.
- **Phase 2** — тест по картинкам, экзамен-симулятор (41 вопрос, проходной балл 85/100), Tier 3-4, дашборд ошибок.
- **Phase 3** — фразы экзаменатора (Tier 5), аудио-тренажёр на слух (Tier 6), PWA/офлайн.
- **Phase 4** — при необходимости: более качественный TTS.
