import { Department } from "./Department";

export interface Course {
  id: number;
  department?: Department;
  code: string;
  descriptive_title: string;
}
