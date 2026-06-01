export function calculateGPA(points: number[]) {
  if (points.length === 0) return 0;

  const total =
    points.reduce(
      (acc: number, item: number) =>
        acc + item,
      0
    );

  return Number(
    (total / points.length).toFixed(2)
  );
}
