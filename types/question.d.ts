import type { Choice } from "./choice";
import type { Tag } from "./tag";

type Question = {
  id: number;
  title: string;
  description: string;
  explanation: string;
  difficulty: number;
  correctAnswers?: any[];
  positiveScore: number;
  negativeScore: number;
  multiCorrect: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  choices: Choice[];
  tag_id: number;
  tags: [Tag];
};
