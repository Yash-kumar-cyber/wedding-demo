import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "rsvps.json");
    let rsvps = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        rsvps = JSON.parse(fileContent);
      } catch {
        rsvps = [];
      }
    }

    const newEntry = {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString(),
    };

    rsvps.push(newEntry);
    fs.writeFileSync(filePath, JSON.stringify(rsvps, null, 2), "utf-8");

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error: any) {
    console.error("RSVP save error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "rsvps.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const rsvps = JSON.parse(fileContent);
      return NextResponse.json({ rsvps });
    }
    return NextResponse.json({ rsvps: [] });
  } catch {
    return NextResponse.json({ rsvps: [] });
  }
}

