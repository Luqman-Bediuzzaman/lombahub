// Hanya isi identitas dan tautan yang telah disetujui untuk ditampilkan ke publik.
// Satu entri per orang atau organisasi. Kontak wawancara disimpan terpisah.
export interface StoryCredit {
  role: "Narasumber" | "Mitra pengusul" | "Penulis";
  name: string;
  profiles?: { platform: string; handle?: string; url: string }[];
}

export const creditsByStory: Partial<Record<string, StoryCredit[]>> = {
  "revisi-presentasi-menjelang-final": [
    {
      role: "Narasumber",
      name: "Luqman Bediuzzaman",
      profiles: [
        { platform: "Instagram", handle: "@lanbediz", url: "https://www.instagram.com/lanbediz/" },
      ],
    },
    { role: "Mitra pengusul", name: "Himpunan mahasiswa (simulasi)", 
      profiles: [
        { platform: "Instagram", handle: "@lanbediz", url: "https://www.instagram.com/lanbediz/" },
      ],
    },
  ],
};
