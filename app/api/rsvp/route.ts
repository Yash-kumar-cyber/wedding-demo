import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// You can also paste your Google Apps Script URL directly here if you prefer:
const HARDCODED_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz8u2L1X8YyGN6jMIMWfshGiZCigXJXKxjnNf6wtxhFqkhfXfziDTk3wASV1n451acIqQ/exec";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Prepare timestamped record
    const newEntry = {
      id: Date.now(),
      fullName: data.fullName || "",
      phone: data.phone || "",
      attending: data.attending || "",
      numberOfGuests: data.numberOfGuests || 0,
      message: data.message || "",
      timestamp: new Date().toISOString(),
    };

    // 2. Local file persistence (Backup)
    try {
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

      rsvps.push(newEntry);
      fs.writeFileSync(filePath, JSON.stringify(rsvps, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Could not write to local rsvps.json backup:", fsErr);
    }

    // 3. Forward to Google Sheet via Google Apps Script Web App
    const sheetWebhookUrl =
      process.env.GOOGLE_SHEET_WEBHOOK_URL ||
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      HARDCODED_GOOGLE_SHEET_URL;

    let sheetStatus = "not_configured";

    if (sheetWebhookUrl && sheetWebhookUrl.trim().startsWith("http")) {
      try {
        const response = await fetch(sheetWebhookUrl.trim(), {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(newEntry),
          redirect: "follow",
        });

        if (response.ok) {
          sheetStatus = "sent";
        } else {
          sheetStatus = `failed_status_${response.status}`;
          console.error("Google Sheet webhook returned error status:", response.status);
        }
      } catch (sheetError: any) {
        sheetStatus = "failed_network";
        console.error("Failed to forward RSVP to Google Sheet:", sheetError);
      }
    } else {
      console.info("No GOOGLE_SHEET_WEBHOOK_URL configured yet. Saved locally in data/rsvps.json.");
    }

    return NextResponse.json({
      success: true,
      entry: newEntry,
      sheetStatus,
    });
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
