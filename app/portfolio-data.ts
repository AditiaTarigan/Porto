export type Skill = {
  id: string;
  label: string;
  color: string;
  description?: string;
};

export const profile = {
  name: "Aditia Xaverius Arapenta Tarigan",
  role: "[Peran atau bidang yang kamu tekuni]",
  intro: "Ganti teks ini dengan perkenalan singkat tentang dirimu.",
};

const skillColors = ["#a9c9ff", "#c8f36a", "#f6a46a", "#bdabff", "#7ce0d1", "#f17878"];

export const skills: Skill[] = Array.from({ length: 12 }, (_, index) => ({
  id: `skill-${index + 1}`,
  label: `Skill ${String(index + 1).padStart(2, "0")}`,
  color: skillColors[index % skillColors.length],
  description: "Ganti dengan teknologi atau keahlian yang kamu kuasai.",
}));

export const achievements = [
  { id: "achievement-1", name: "[Nama sertifikasi]", issuer: "[Penerbit]", year: "[Tahun]" },
  { id: "achievement-2", name: "[Nama sertifikasi]", issuer: "[Penerbit]", year: "[Tahun]" },
  { id: "achievement-3", name: "[Nama sertifikasi]", issuer: "[Penerbit]", year: "[Tahun]" },
];

export const projects = [
  {
    id: "project-1",
    name: "[Nama proyek]",
    description: "Tambahkan ringkasan singkat tentang proyek yang kamu kerjakan.",
    stack: "[Teknologi yang digunakan]",
  },
  {
    id: "project-2",
    name: "[Nama proyek]",
    description: "Tambahkan ringkasan singkat tentang proyek yang kamu kerjakan.",
    stack: "[Teknologi yang digunakan]",
  },
];
