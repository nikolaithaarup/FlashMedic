export type Difficulty = "easy" | "medium" | "hard";

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;      // fx "Sygdomslære", "EKG", "Farmakologi"
  topic: string;        // fx "Akut medicin", "Arytmier"
  tags?: string[];
  image?: string;       // optional – path eller nøgle til EKG-billede
};

