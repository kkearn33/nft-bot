import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const newData = await req.json(); // Get new data from request body
    const filePath = path.join(process.cwd(), "Wallets.json");

    let existingData = [];

    if (!fs.existsSync(filePath)) {
      console.warn("data.json not found. Creating a new file.");
      fs.writeFileSync(filePath, "[]"); // Initialize as empty array
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(fileContent || "[]"); // Default to empty array if empty
    } catch (error) {
      console.warn("Invalid JSON detected. Resetting data.json.");
      existingData = [];
    }

    existingData.push(...newData); // Append new data

    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ message: "Data written successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
