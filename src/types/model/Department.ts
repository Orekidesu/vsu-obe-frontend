import { Faculty } from "./Faculty";

export interface Department {
  id: number;
  name: string;
  abbreviation: string;
  faculty: Faculty;
}
