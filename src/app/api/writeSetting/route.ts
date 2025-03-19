import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const newData = await req.json(); // Get new data from request body
    const filePath = path.join(process.cwd(), "setting.json");

    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    return NextResponse.json({ message: "Data written successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
