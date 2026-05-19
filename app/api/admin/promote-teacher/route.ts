import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const role = (session.user as any).role as string | undefined;
    if (role !== 'SYSTEM_ADMIN' && role !== 'SCHOOL_ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const { userId } = await req.json();
    if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

    const existing = await prisma.teacher.findFirst({ where: { userId } });
    if (existing) return new Response(JSON.stringify({ error: 'Teacher record already exists' }), { status: 400 });

    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const [teacher] = await prisma.$transaction([
      prisma.teacher.create({
        data: {
          firstName,
          lastName,
          email: user.email,
          userId: user.id,
        },
      }),
      prisma.user.update({ where: { id: user.id }, data: { role: 'TEACHER', status: 'APPROVED' } }),
    ]);

    return new Response(JSON.stringify({ teacher }), { status: 201 });
  } catch (err) {
    console.error('/api/admin/promote-teacher error', err);
    return new Response(JSON.stringify({ error: (err as any).message ?? 'Error' }), { status: 500 });
  }
}
