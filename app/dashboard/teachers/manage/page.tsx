import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PromoteButton from '../promote-button';
import { getSession } from '@/lib/get-session';

export default async function ManageTeachersPage() {
  const teachers = await prisma.teacher.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });

  const roleOnlyUsers = await prisma.user.findMany({ where: { role: 'TEACHER', teacher: { is: null } } });

  const session = await getSession();
  const role = (session?.user as any)?.role as string | undefined;
  const isAdmin = role === 'SYSTEM_ADMIN' || role === 'SCHOOL_ADMIN';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Teachers</h1>

      <div className="grid gap-4">
        {/* Render explicit teacher records first */}
        {teachers.map((t) => (
          <div key={t.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.firstName} {t.lastName}</div>
                <div className="text-sm text-slate-500">{t.email}</div>
                <div className="text-sm text-slate-500">{t.qualification ?? ''}</div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/dashboard/teachers/${t.id}`} className="text-blue-600">View</Link>
                <Link href={`/dashboard/teachers/edit/${t.id}`} className="text-yellow-600">Edit</Link>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">Promoted</span>
              </div>
            </div>
          </div>
        ))}

        {/* Render users that have role TEACHER but no Teacher record yet */}
        {roleOnlyUsers.map((u) => (
          <div key={u.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-slate-500">{u.email}</div>
              </div>

              <div>
                  {isAdmin ? <PromoteButton userId={u.id} /> : <span className="text-sm text-slate-400">Admin only</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
