export interface Photographer {
  personId: string;
  login: string;
  passwordHash:string;
  email: string | null;
  fullName: string | null;
}
