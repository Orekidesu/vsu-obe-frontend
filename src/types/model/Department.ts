import { Faculty } from "./Faculty";
import { Program } from "./Program";

export interface Department {
  id: number;
  name: string;
  abbreviation: string;
  faculty: Faculty;
  programs?: Program[];
}
