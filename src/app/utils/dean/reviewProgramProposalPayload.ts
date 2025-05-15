export interface ReviewProposalPayload {
  status: string;
  department_level?: Array<{ section: string; details: string }>;
  committee_level?: Array<{
    curriculum_course_id: number;
    section: string;
    details: string;
  }>;
}
