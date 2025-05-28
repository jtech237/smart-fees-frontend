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
  personalId?: number
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
  profile_id?: number
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
  status: "PRE" | "DOC" | "PAY" | "REG";
  student: StudentBase;
  createdAt: string | Date;
}

interface RegistrationResponse {
  items: Registration[];
  count: number;
}

interface StudentProfile {
  id: number;
  firstname: string;
  lastname: string;
  dateOfBirth: string | Date;
  classe: Pick<Classe, "id" | "name">;
  matricule: string;
  password: string;
  "placeOfBirth": string,
  "gender": "F" | "M",
  "address"?: string,
  "city"?: string,
  "country": string,
  "primaryLanguage": 'fr' | 'en',
  "secondaryLanguage": 'fr' | 'en',
  "entryDiploma": string,
  "mention": string,
  "yearOfObtention": string,
  "countryOfObtention": string,
  "obtainingInstitution": string,
  "acceptedCgu": false
}

export type {
  UserType,
  UserResponse,
  StudentBase,
  StudentBaseResponse,
  RegistrationResponse,
  Registration,
  StudentProfile
};
