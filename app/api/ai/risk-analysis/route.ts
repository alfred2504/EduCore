function classifyRisk(gpa: number, attendance: number) {
  if (attendance < 70 || gpa < 1.5) {
    return {
      risk: "HIGH RISK",
      recommendation:
        "Immediate intervention required with academic support and attendance monitoring.",
    };
  }

  if (attendance < 80 || gpa < 2.5) {
    return {
      risk: "MEDIUM RISK",
      recommendation:
        "Monitor progress closely and provide targeted academic support.",
    };
  }

  return {
    risk: "LOW RISK",
    recommendation: "Continue current support and maintain engagement.",
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gpa = Number(body.gpa ?? 0);
    const attendance = Number(body.attendance ?? 0);

    const result = classifyRisk(gpa, attendance);

    return Response.json({
      ...result,
      gpa,
      attendance,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to analyze academic risk",
      },
      {
        status: 500,
      }
    );
  }
}
