// Реальные проекты Даниила. link: null, если исходников нет в открытом доступе.
export const projects = [
  {
    title: "Помощник добивания в Dota 2",
    text: "Смотрит на картинку игры и показывает над полоской здоровья крипа, сколько ударов осталось до добивания. Ничего не читает из памяти игры и не нажимает за игрока. Полоски находит по форме, урон героя читает встроенным OCR Windows.",
    tags: ["Python", "компьютерное зрение", "OCR", "pytest"],
    link: { href: "https://github.com/iseedeadpeople792/dota-lasthit", label: "Смотреть код" },
    colors: ["#ff7aa8", "#ffb199"],
  },
  {
    title: "Dota 2 Статистика",
    text: "Настольное приложение с данными OpenDota: форма за последние игры, винрейт и KDA по ролям и времени суток, темп добивания против эталонов, подбор героя против выбранных врагов. Собирается в готовый .exe.",
    tags: ["JavaScript", "Python", "OpenDota API", "Windows"],
    link: { href: "https://github.com/iseedeadpeople792/dota2-stats", label: "Смотреть код" },
    colors: ["#c77dff", "#ff7aa8"],
  },
  {
    title: "Бот записи клиентов",
    text: "Клиент выбирает день и свободное время кнопками, мастер получает уведомление, занятое время скрывается. Работает на бесплатном тарифе Cloudflare, без сервера и абонплаты.",
    tags: ["JavaScript", "Cloudflare Workers", "KV", "Telegram"],
    link: { href: "https://iseedeadpeople792.github.io/bots-portfolio/", label: "Открыть демо" },
    colors: ["#ffb199", "#ffd08a"],
  },
  {
    title: "Сокращатель ссылок",
    text: "Короткие ссылки на Cloudflare Workers и KV. Принимает только http и https, код без похожих символов, понятные ошибки.",
    tags: ["JavaScript", "Cloudflare Workers", "KV"],
    link: { href: "https://github.com/iseedeadpeople792/url-shortener-worker", label: "Смотреть код" },
    colors: ["#ff8fa3", "#c77dff"],
  },
  {
    title: "Анализатор логов",
    text: "Консольный анализатор access-логов в формате combined, подходит для nginx и Apache. Без внешних зависимостей.",
    tags: ["Python", "CLI"],
    link: { href: "https://github.com/iseedeadpeople792/log-analyzer", label: "Смотреть код" },
    colors: ["#ffd08a", "#ff7aa8"],
  },
  {
    title: "Трекер привычек",
    text: "Привычки, отметки по дням, текущая и рекордная серии. Работает в браузере без сборки, данные хранятся у пользователя.",
    tags: ["JavaScript", "localStorage"],
    link: { href: "https://github.com/iseedeadpeople792/habit-tracker", label: "Смотреть код" },
    colors: ["#ff7aa8", "#9d7bff"],
  },
];
