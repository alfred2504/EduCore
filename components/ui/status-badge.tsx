interface Props {
  status: string;
}

export function StatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`
        rounded-full px-3 py-1 text-sm font-medium

        ${
          status === "APPROVED"
            ? "bg-green-100 text-green-700"

            : status === "PENDING"
            ? "bg-yellow-100 text-yellow-700"

            : "bg-red-100 text-red-700"
        }
      `}
    >
      {status}
    </span>
  );
}