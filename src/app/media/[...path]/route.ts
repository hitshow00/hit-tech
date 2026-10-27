import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";

const UPLOAD_ROOT = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || "./storage/uploads");
const PUBLIC_MEDIA_ROOT = path.resolve(/*turbopackIgnore: true*/ "./public/media");

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await props.params;

  if (!segments || segments.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Protection contre le path traversal
  const targetUpload = path.resolve(UPLOAD_ROOT, ...segments);
  const targetPublic = path.resolve(PUBLIC_MEDIA_ROOT, ...segments);

  let target = targetUpload;
  try {
    await fs.access(target);
  } catch {
    target = targetPublic;
  }

  if (!target.startsWith(UPLOAD_ROOT) && !target.startsWith(PUBLIC_MEDIA_ROOT)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const fileBuffer = await fs.readFile(target);
    const ext = path.extname(target).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return new NextResponse("Not Found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
