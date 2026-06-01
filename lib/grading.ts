export function calculateGrade(score: number) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";

  return "F";
}

export function gradePoints(score: number) {
  if (score >= 80) return 4.0;
  if (score >= 70) return 3.0;
  if (score >= 60) return 2.0;
  if (score >= 50) return 1.0;

  return 0;
}
