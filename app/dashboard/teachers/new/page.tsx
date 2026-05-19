export default function NewTeacherPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">
        Add Teacher
      </h1>

      <form className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium">
            First Name
          </label>

          <input
            className="mt-2 w-full rounded-xl border p-3"
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Last Name
          </label>

          <input
            className="mt-2 w-full rounded-xl border p-3"
            placeholder="Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Email
          </label>

          <input
            className="mt-2 w-full rounded-xl border p-3"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Subject
          </label>

          <input
            className="mt-2 w-full rounded-xl border p-3"
            placeholder="Mathematics"
          />
        </div>

        <button
          className="rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          Create Teacher
        </button>
      </form>
    </div>
  );
}