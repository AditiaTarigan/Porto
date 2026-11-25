export type Skill = {
  id: string;
  name: string;
  mark: string;
  color: string;
  hotkey: string;
  line: string;
};

export const profile = {
  name: "Aditia Xaverius Arapenta Tarigan",
  role: "Developer · interactive web experiences",
  intro: "Building playful interfaces, one key at a time.",
  email: "email@contoh.com",
};

const colors = ["#f5a14a", "#73a9ff", "#36c8b3", "#ee5e53", "#ae83f5", "#71cf68", "#f1d35b", "#e7ecef", "#22272b"];
const hotkeys = "1234567890qwertyuiopasdfg".split("");

const technologies = [
  ["JavaScript", "JS", "JavaScript: making the browser do the thing since '95."],
  ["TypeScript", "TS", "TypeScript: JavaScript, now with receipts."],
  ["React", "⚛", "React: a little component of my imagination."],
  ["Next.js", "N", "Next.js: because one more route never hurt."],
  ["Node.js", "JS", "Node.js: JavaScript escaped the browser."],
  ["Express", "ex", "Express: routing requests without the drama."],
  ["MongoDB", "M", "MongoDB: documents all the way down."],
  ["PostgreSQL", "PG", "PostgreSQL: structured and not afraid to show it."],
  ["Tailwind", "T", "Tailwind: yes, all those classes are on purpose."],
  ["HTML5", "5", "HTML: putting the pieces where they belong."],
  ["CSS3", "3", "CSS: making pixels look like they had a plan."],
  ["Git", "⑂", "Git: save points for code that got ambitious."],
  ["GitHub", "GH", "GitHub: where 'just one more commit' lives."],
  ["Docker", "D", "Docker: works on my machine, now everywhere."],
  ["AWS", "aws", "AWS: the cloud is someone else's computer."],
  ["WordPress", "W", "WordPress: a classic with a plugin for that."],
  ["Python", "Py", "Python: readable enough before coffee."],
  ["C", "C", "C: close to the metal, closer to the bugs."],
  ["Linux", "Lx", "Linux: the terminal is home now."],
  ["Vue", "V", "Vue: reactive UI, less reactive panic."],
  ["Redis", "R", "Redis: fast enough to forget it was a database."],
  ["Vite", "V", "Vite: blink and your dev server is ready."],
  ["Figma", "F", "Figma: the pixels had a meeting first."],
  ["Firebase", "Fb", "Firebase: backend errands, handled."],
  ["GraphQL", "GQL", "GraphQL: ask for exactly what you want."],
] as const;

export const skills: Skill[] = technologies.map(([name, mark, line], index) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  mark,
  color: colors[index % colors.length],
  hotkey: hotkeys[index],
  line,
}));

export const projects = [
  { id: "project-1", name: "Orbit Dashboard", description: "A responsive analytics dashboard with a calm, focused workspace.", stack: ["React", "TypeScript", "Tailwind"], tone: "lime", demoUrl: "", githubUrl: "" },
  { id: "project-2", name: "Tiny Commerce", description: "A compact storefront concept built around clear product discovery.", stack: ["Next.js", "Node.js", "PostgreSQL"], tone: "blue", demoUrl: "", githubUrl: "" },
  { id: "project-3", name: "Motion Notes", description: "An experimental note-taking interface with playful motion details.", stack: ["JavaScript", "CSS3", "Figma"], tone: "orange", demoUrl: "", githubUrl: "" },
  { id: "project-4", name: "Pocket API", description: "A small API playground for learning and testing endpoints.", stack: ["Express", "MongoDB", "Docker"], tone: "violet", demoUrl: "", githubUrl: "" },
];

export const socials = [
  { name: "GitHub", mark: "GH", url: "" },
  { name: "LinkedIn", mark: "in", url: "" },
  { name: "X", mark: "𝕏", url: "" },
  { name: "Instagram", mark: "◎", url: "" },
];
