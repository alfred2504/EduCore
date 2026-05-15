import { prisma } from "@/lib/prisma";

export default async function TeachersPage() {
	const teachers = await prisma.teacher.findMany();

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Teachers</h1>

				<p className="mt-2 text-slate-500">Teacher management</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{teachers.map((t) => (
					<div key={t.id} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
						<h2 className="text-xl font-bold">{t.firstName} {t.lastName}</h2>
						<p className="mt-1 text-slate-500">{t.email}</p>
					</div>
				))}
			</div>
		</div>
	);
}

