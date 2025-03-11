import { Department } from "@types/model/Department";
export interface Faculty {
  id: number;
  name: string;
  abbreviation: string;
  departments: Department[];
}
