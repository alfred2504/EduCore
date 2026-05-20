export function detectAnomaly(
  amount: number,
  average: number
) {
  return amount >
    average * 2;
}