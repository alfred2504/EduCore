import { notFound } from "next/navigation";

import { MarksEntryForm } from "@/components/exams/marks-entry-form";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExamMarksPage({
  params,
}: PageProps) {
  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      subject: true,
      class: true,
      term: true,
      results: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!exam) {
    notFound();
  }

  const students = await prisma.student.findMany({
    where: {
      classId: exam.classId,
    },
    orderBy: {
      firstName: "asc",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      admissionNumber: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
          Marks Entry
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          {exam.title}
        </h1>
        <p className="mt-2 text-slate-500">
          Select a learner, enter marks, and auto-calculate the grade.
        </p>
      </div>

      <MarksEntryForm
        exam={{
          id: exam.id,
          title: exam.title,
          type: exam.type,
          totalMarks: exam.totalMarks,
          published: exam.published,
          subject: {
            name: exam.subject.name,
          },
          class: {
            name: exam.class.name,
          },
        }}
        students={students}
        existingResults={exam.results.map((result) => ({
          studentId: result.studentId,
          marks: result.marks,
          grade: result.grade,
          points: result.points,
          remarks: result.remarks,
        }))}
      />
    </div>
  );
}
