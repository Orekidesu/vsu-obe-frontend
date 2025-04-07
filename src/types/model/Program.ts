import { Department } from "./Department";

export interface Program {
  id: number;
  department: Department;
  name: string;
  abbreviation: string;
  status: string;
  version: number;
}
