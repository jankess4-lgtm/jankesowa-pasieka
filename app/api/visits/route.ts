import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'visits.json');

export async function GET() {
  try {
    // Upewnij się, że folder data istnieje
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let visits = 0;
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      visits = JSON.parse(data).visits || 0;
    } else {
      fs.writeFileSync(filePath, JSON.stringify({ visits: 0 }));
    }

    // Zwiększ licznik
    visits += 1;
    fs.writeFileSync(filePath, JSON.stringify({ visits }));

    return NextResponse.json({ visits });
  } catch (error) {
    console.error("Licznik odwiedzin error:", error);
    return NextResponse.json({ visits: 0 });
  }
}