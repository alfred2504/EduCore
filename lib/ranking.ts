export function rankStudents(
  students: {
    studentId: string;
    gpa: number;
  }[]
) {
  return students
    .sort((a, b) => b.gpa - a.gpa)
    .map((student, index) => ({
      ...student,
      position: index + 1,
    }));
}
