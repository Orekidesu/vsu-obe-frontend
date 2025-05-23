export interface CurriculumCoursePO {
  id: number;
  ied: string[];
  name: string;
  statement: string;
}

export interface CurriculumCoursePOResponse {
  data: CurriculumCoursePO[];
}
