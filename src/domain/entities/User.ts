export enum UserRole {
  ADMIN = "Admin",
  DOCENTE = "Docente",
  DOCENTE_EXPERTO = "DocenteExperto",
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}
