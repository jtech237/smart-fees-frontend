import { Classe } from "./classes";

interface UserType {
  id: number;
  username: string;
  email?: string;
  name?: string | null;
  accessToken: string;
  refreshToken: string;
  role: string;
  expire_in: number;
}

interface UserResponse {
  id: number;
  role: string;
  username: string;
  email: string;
  name: string;
  access: string;
  refresh: string;
  expires: number;
}

interface StudentBase {
  id: number;
  lastname?: string;
  firstname: string;
  dateOfBirth: string | Date;
  classe: Pick<Classe, "id" | "name">;
  matricule: string;
}

interface StudentBaseResponse {
  items: Array<StudentBase>;
  count: number;
}

interface Registration {
  id: number;
  status: string;
  student: StudentBase;
  createdAt: string | Date;
}

interface RegistrationResponse {
  items: Registration[];
  count: number;
}

export type {
  UserType,
  UserResponse,
  StudentBase,
  StudentBaseResponse,
  RegistrationResponse,
  Registration,
};
