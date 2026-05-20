"use client";

interface Props {
  value: string;
  onChange: (
    value: string
  ) => void;
}

export function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder="Search..."
      className="w-full rounded-xl border px-4 py-3"
    />
  );
}