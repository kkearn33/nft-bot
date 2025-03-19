import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "setting.json"); // Path to JSON file
    const jsonData = fs.readFileSync(filePath, "utf-8"); // Read file
    const data = JSON.parse(jsonData); // Parse JSON
    return NextResponse.json(data); // Return JSON response
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data." }, { status: 500 });
  }
}
