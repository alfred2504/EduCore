"use client";

const notifications = [
  {
    title:
      "New procurement request",
  },

  {
    title:
      "Fee payment received",
  },

  {
    title:
      "Teacher added",
  },
];

export function NotificationCenter() {
  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-[#111827]">
      <h2 className="mb-4 text-xl font-bold">
        Notifications
      </h2>

      <div className="space-y-4">
        {notifications.map(
          (notification, index) => (
            <div
              key={index}
              className="rounded-xl border p-4"
            >
              {notification.title}
            </div>
          )
        )}
      </div>
    </div>
  );
}