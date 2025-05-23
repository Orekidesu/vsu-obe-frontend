export function getSemesterName(semesterCode: string): string {
  switch (semesterCode) {
    case "first":
      return "First Semester";
    case "second":
      return "Second Semester";
    case "midyear":
      return "Midyear";
    default:
      return semesterCode;
  }
}
