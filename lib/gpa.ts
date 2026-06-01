export function calculateGPA(points: number[]) {
  if (points.length === 0) {
    return 0;
  }

  return Number(
    (
      points.reduce(
        (a, b) => a + b,
        0
      ) / points.length
    ).toFixed(2)
  );
}
