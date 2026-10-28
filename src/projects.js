// Реальные проекты Даниила. link: null, если исходников нет в открытом доступе.
// en: английские title, text и теги (теги без перевода повторяются как есть).
export const projects = [
  {
    title: "Помощник добивания в Dota 2",
    text: "Смотрит на картинку игры и показывает над полоской здоровья крипа, сколько ударов осталось до добивания. Ничего не читает из памяти игры и не нажимает за игрока. Полоски находит по форме, урон героя читает встроенным OCR Windows.",
    tags: ["Python", "компьютерное зрение", "OCR", "pytest"],
    en: {
      title: "Last-hit helper for Dota 2",
      text: "Looks at the game picture and shows above a creep's health bar how many hits are left to a last hit. Reads nothing from game memory and presses nothing for the player. Finds bars by shape and reads the hero's damage with the built-in Windows OCR.",
      tags: ["Python", "computer vision", "OCR", "pytest"],
    },
    link: { href: "./lasthit/", label: "Открыть сайт проекта" },
    repo: "https://github.com/iseedeadpeople792/dota-lasthit",
    colors: ["#ff7aa8", "#ffb199"],
  },
  {
    title: "Dota 2 Статистика",
    text: "Настольное приложение с данными OpenDota: форма за последние игры, винрейт и KDA по ролям и времени суток, темп добивания против эталонов, подбор героя против выбранных врагов. Собирается в готовый .exe.",
    tags: ["JavaScript", "Python", "OpenDota API", "Windows"],
    en: {
      title: "Dota 2 Stats",
      text: "A desktop app with OpenDota data: form over recent games, win rate and KDA by role and time of day, last-hit pace against benchmarks, hero picks against chosen enemies. Builds into a ready .exe.",
    },
    link: { href: "./stats/", label: "Открыть сайт проекта" },
    repo: "https://github.com/iseedeadpeople792/dota2-stats",
    colors: ["#c77dff", "#ff7aa8"],
  },
  {
    title: "Бот записи клиентов",
    text: "Клиент выбирает день и свободное время кнопками, мастер получает уведомление, занятое время скрывается. Работает на бесплатном тарифе Cloudflare, без сервера и абонплаты.",
    tags: ["JavaScript", "Cloudflare Workers", "KV", "Telegram"],
    en: {
      title: "Client booking bot",
      text: "The client picks a day and a free time with buttons, the master gets a notification, busy time is hidden. Runs on Cloudflare's free tier, with no server and no subscription.",
    },
    link: { href: "https://iseedeadpeople792.github.io/bots-portfolio/", label: "Открыть демо", labelEn: "Open the demo" },
    colors: ["#ffb199", "#ffd08a"],
  },
  {
    title: "Сокращатель ссылок",
    text: "Короткие ссылки на Cloudflare Workers и KV. Принимает только http и https, код без похожих символов, понятные ошибки.",
    tags: ["JavaScript", "Cloudflare Workers", "KV"],
    en: {
      title: "URL shortener",
      text: "Short links on Cloudflare Workers and KV. Accepts only http and https, a code without look-alike characters, clear errors.",
    },
    link: { href: "./shortener/", label: "Открыть сайт проекта" },
    repo: "https://github.com/iseedeadpeople792/url-shortener-worker",
    colors: ["#ff8fa3", "#c77dff"],
  },
  {
    title: "Анализатор логов",
    text: "Консольный анализатор access-логов в формате combined, подходит для nginx и Apache. Без внешних зависимостей.",
    tags: ["Python", "CLI"],
    en: {
      title: "Log analyzer",
      text: "A console analyzer for access logs in the combined format, works with nginx and Apache. No external dependencies.",
    },
    link: { href: "./logs/", label: "Открыть сайт проекта" },
    repo: "https://github.com/iseedeadpeople792/log-analyzer",
    colors: ["#ffd08a", "#ff7aa8"],
  },
  {
    title: "Трекер привычек",
    text: "Привычки, отметки по дням, текущая и рекордная серии. Работает в браузере без сборки, данные хранятся у пользователя.",
    tags: ["JavaScript", "localStorage"],
    en: {
      title: "Habit tracker",
      text: "Habits, day-by-day marks, current and record streaks. Works in the browser with no build step; the data stays with the user.",
    },
    link: { href: "./habits/", label: "Открыть сайт проекта" },
    repo: "https://github.com/iseedeadpeople792/habit-tracker",
    colors: ["#ff7aa8", "#9d7bff"],
  },
];
