import jsPDF from "jspdf";

import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    studentId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { studentId } = await params;
    const url = new URL(request.url);
    const format = url.searchParams.get("format");

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        class: true,
        results: {
          include: {
            exam: {
              include: {
                subject: true,
                term: true,
              },
            },
          },
        },
        reportCards: {
          include: {
            term: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        attendances: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!student) {
      return Response.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const payload = {
      student,
      academicHistory: {
        exams: student.results,
        reportCards: student.reportCards,
        attendance: student.attendances,
      },
    };

    if (format === "pdf") {
      const doc = new jsPDF();
      let cursorY = 18;

      doc.setFontSize(18);
      doc.text("EduCore Transcript", 14, cursorY);
      cursorY += 10;

      doc.setFontSize(12);
      doc.text(`Student: ${student.firstName} ${student.lastName}`, 14, cursorY);
      cursorY += 8;
      doc.text(`Admission Number: ${student.admissionNumber}`, 14, cursorY);
      cursorY += 8;
      doc.text(`Class: ${student.class?.name ?? "N/A"}`, 14, cursorY);
      cursorY += 12;

      doc.text("Report Cards", 14, cursorY);
      cursorY += 8;

      student.reportCards.forEach((reportCard) => {
        doc.text(
          `${reportCard.term.name}: GPA ${reportCard.gpa ?? 0} | Position ${reportCard.position ?? "-"}`,
          14,
          cursorY
        );
        cursorY += 7;
      });

      cursorY += 5;
      doc.text("Exam Results", 14, cursorY);
      cursorY += 8;

      student.results.forEach((result) => {
        doc.text(
          `${result.exam.title} (${result.exam.subject.name}) - ${result.marks}/${result.exam.totalMarks} - ${result.grade ?? "N/A"}`,
          14,
          cursorY
        );
        cursorY += 7;
      });

      const pdf = doc.output("arraybuffer");
      return new Response(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${student.admissionNumber}-transcript.pdf"`,
        },
      });
    }

    return Response.json(payload);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to generate transcript",
      },
      {
        status: 500,
      }
    );
  }
}
