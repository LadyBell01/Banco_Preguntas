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
  id: number;
  statement: string;
  difficulty: Difficulty;
  categoryId: number;
  status: QuestionStatus;
  active: number;
}
