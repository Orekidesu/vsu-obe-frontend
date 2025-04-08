import { Program } from "./Program";

export interface ProgramProposal {
  id: number;
  program: Program;
  abbreviation: string;
  status: string;
  version: number;
  comment: string;
  created_at: string;
  updated_at: string;
}
