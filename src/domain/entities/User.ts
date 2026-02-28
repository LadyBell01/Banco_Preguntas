export enum UserRole {
  ADMIN = "Admin",
  DOCENTE = "Docente",
  DOCENTE_EXPERTO = "DocenteExperto",
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: number;
}
