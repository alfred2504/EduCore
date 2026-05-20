interface Activity {
  title: string;
  date: string;
}

interface Props {
  activities: Activity[];
}

export function ActivityTimeline({
  activities,
}: Props) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="rounded-2xl border p-4"
        >
          <p className="font-medium">
            {activity.title}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {activity.date}
          </p>
        </div>
      ))}
    </div>
  );
}
