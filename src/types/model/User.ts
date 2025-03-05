import { Department } from "./Department";
import { Faculty } from "./Faculty";
import { Role } from "./Role";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
  faculty: Faculty;
  department: Department;
}
