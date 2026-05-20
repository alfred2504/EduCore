export function calculateRisk(
  gradeAverage: number,
  attendanceRate: number
) {
  let risk = 0;

  if (gradeAverage < 50)
    risk += 50;

  if (attendanceRate < 70)
    risk += 50;

  if (risk >= 70)
    return "HIGH";

  if (risk >= 40)
    return "MEDIUM";

  return "LOW";
}