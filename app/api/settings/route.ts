import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const FALLBACK_PATH = path.resolve(process.cwd(), "data", "site-settings.json");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function readFallback() {
  try {
    if (!fs.existsSync(FALLBACK_PATH)) return null;
    const raw = fs.readFileSync(FALLBACK_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("settings fallback read error:", e);
    return null;
  }
}

function writeFallback(obj: unknown) {
  try {
    const dir = path.dirname(FALLBACK_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FALLBACK_PATH, JSON.stringify(obj, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("settings fallback write error:", e);
    return false;
  }
}

export async function GET() {
  try {
    try {
      const settings = await prisma.siteSetting.findFirst();
      if (!settings) {
        const fb = readFallback();
        if (fb) return NextResponse.json(fb);

        return NextResponse.json({ siteTitle: "EduCore", schoolName: null, contactEmail: null });
      }

      return NextResponse.json(settings);
    } catch (dbErr) {
      console.warn("Prisma unreachable, falling back to file storage:", getErrorMessage(dbErr));
      const fb = readFallback();
      if (fb) return NextResponse.json(fb);
      return NextResponse.json({ siteTitle: "EduCore", schoolName: null, contactEmail: null });
    }
  } catch (err) {
    console.error("/api/settings GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "SYSTEM_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { siteTitle, schoolName, contactEmail } = body;

    try {
      const existing = await prisma.siteSetting.findFirst();
      if (existing) {
        const updated = await prisma.siteSetting.update({ where: { id: existing.id }, data: { siteTitle, schoolName, contactEmail } });
        return NextResponse.json(updated);
      }

      const created = await prisma.siteSetting.create({ data: { siteTitle, schoolName, contactEmail } });
      return NextResponse.json(created);
    } catch (dbErr) {
      console.warn("Prisma unreachable, persisting settings to file:", getErrorMessage(dbErr));
      const obj = { siteTitle, schoolName, contactEmail, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      const ok = writeFallback(obj);
      if (!ok) return NextResponse.json({ error: "Failed to persist settings" }, { status: 500 });
      return NextResponse.json(obj);
    }
  } catch (err) {
    console.error("/api/settings PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
