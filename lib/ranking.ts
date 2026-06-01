export interface RankedStudent {
  studentId: string;
  studentName: string;
  gpa: number;
}

export function rankStudents(
  students: RankedStudent[]
) {
  return students
    .sort((a, b) => b.gpa - a.gpa)
    .map((student, index) => ({
      ...student,
      position: index + 1,
    }));
}
