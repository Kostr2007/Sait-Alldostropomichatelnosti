# 🌆 Достопримечательности Набережных Челнов

Современный сайт-путеводитель по всем интересным местам Набережных Челнов.

Полная переделка старых версий. На этот раз — **по уму**, с чистой архитектурой, хорошим UX и современным стеком.

![Hero](public/images/hero-kama.jpg) <!-- потом заменишь на реальное фото -->

## ✨ Особенности

- Красивый и быстрый (Astro + Tailwind)
- Интерактивная карта (MapLibre GL)
- Фильтры, поиск и карточки достопримечательностей
- Адаптивный дизайн в стиле GNOME/Adwaita + татарские акценты
- Dark/Light тема
- Легко добавлять новые объекты через Markdown

## 🛠️ Технический стек

- **Astro 6** — основной фреймворк
- **TypeScript**
- **React** — для интерактивных компонентов
- **Tailwind CSS** + собственные стили
- **MapLibre GL** — карта
- **sharp** — оптимизация изображений
- **Formspree** — формы без бэкенда
- **Content Collections** — удобная работа с Markdown

## 🚀 Как запустить локально

```bash
# 1. Клонируем
git clone https://github.com/Kostr2007/Sait-Alldostropomichatelnosti.git
cd Sait-Alldostropomichatelnosti

# 2. Устанавливаем зависимости
npm install

# 3. Запускаем dev-сервер
npm run dev
```

## Как работать с сайтом! 🧤😺🥼

```
git checkout main
git pull --rebase origin main   # сначала синхронизируйся!

# ... делаешь изменения

git add .
git commit -m "..."
git push

```

## Стркуктура проекта 🐱🌳

Если забуду **Я** или **ТЫ** где лежать файлы, то вот тебе шпаргалка по структуре проекта:

```

.
├── public
│   ├── favicon.ico
│   └── favicon.svg
├── src
│   ├── assets
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── content
│   │   └── attractions
│   │       └── template.md
│   ├── layouts
│   │   └── Layout.astro
│   ├── pages
│   │   └── index.astro
│   └── styles
│       └── global.css
├── astro.config.mjs
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json

```

## Обновление 0.0.1

Добавлено:

- Шаблон достропомичательности в `src/content/attractions/template.md` 📃
- Снесено случайно README.md, переделано заново. 😿
