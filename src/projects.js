// Реальные проекты Даниила. link: null, если исходников нет в открытом доступе.
// does: пояснение «что делает» для окна проекта (ru/en).
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
    does: { ru: ["Снимает картинку игры, в память игры не заглядывает", "Находит полоски здоровья крипов по форме", "Читает урон героя встроенным OCR Windows", "Показывает над полоской, сколько ударов осталось до добивания"], en: ["Takes the game picture and never looks into game memory", "Finds creep health bars by shape", "Reads the hero's damage with the built-in Windows OCR", "Shows above the bar how many hits are left to a last hit"] },
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
    does: { ru: ["Загружает данные матчей из OpenDota", "Считает форму, винрейт и KDA по ролям и времени суток", "Сравнивает темп добивания с эталонами", "Подбирает героя против выбранных врагов"], en: ["Loads match data from OpenDota", "Counts form, win rate and KDA by role and time of day", "Compares last-hit pace with benchmarks", "Picks a hero against the chosen enemies"] },
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
    does: { ru: ["Клиент выбирает день и время кнопками в Telegram", "Занятое время скрывается, двойных записей не бывает", "Мастер получает уведомление о каждой записи", "Работает на бесплатном Cloudflare, без сервера и абонплаты"], en: ["The client picks a day and time with buttons in Telegram", "Busy time is hidden, so there are no double bookings", "The master gets a notification for every booking", "Runs on free Cloudflare, no server and no subscription"] },
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
    does: { ru: ["Принимает длинную ссылку и пропускает только http и https", "Делает короткий код без похожих символов", "Хранит пару «код — ссылка» в Cloudflare KV", "Если что-то не так, объясняет понятной ошибкой"], en: ["Takes a long link and lets through only http and https", "Makes a short code without look-alike characters", "Stores the code-to-link pair in Cloudflare KV", "Explains problems with a clear error"] },
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
    does: { ru: ["Читает access-лог построчно, большой файл не забивает память", "Считает запросы и долю ошибок 4xx и 5xx", "Показывает самые частые страницы и IP", "Работает с форматом combined: nginx и Apache"], en: ["Reads the access log line by line, so a big file doesn't eat memory", "Counts requests and the share of 4xx and 5xx errors", "Shows the most frequent pages and IPs", "Works with the combined format: nginx and Apache"] },
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
    does: { ru: ["Вы заводите привычки и отмечаете выполненные дни", "Считает текущую и рекордную серии", "Хранит данные в браузере, регистрации нет", "Работает без сборки: открыл страницу и пользуешься"], en: ["You add habits and mark the days you did them", "Counts the current and the record streak", "Keeps data in the browser, no sign-up", "Works with no build step: open the page and use it"] },
    colors: ["#ff7aa8", "#9d7bff"],
  },
];
