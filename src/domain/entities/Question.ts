export enum Difficulty {
  BAJA = "Baja",
  MEDIA = "Media",
  ALTA = "Alta",
}

export enum QuestionStatus {
  BORRADOR = "Borrador",
  REVISION = "Revisión",
  APROBADA = "Aprobada",
  RECHAZADA = "Rechazada",
  PUBLICADA = "Publicada",
}

export interface Question {
  id_questions: number;
  statement: string;
  difficulty: Difficulty;
  category_id: number;
  status: QuestionStatus;
  active: number;
}
