import { Program } from "./Program";

export interface ProgramOutcome {
  id: number;
  program?: Program;
  name: string;
  statement: string;
}
