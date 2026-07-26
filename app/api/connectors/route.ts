import { NextResponse } from "next/server";

import { listAdapters } from "@/lib/connectors/registry";

/**
 * GET /api/connectors
 * Capability manifest for every registered platform. The dashboard uses this
 * to decide which widgets to render and which "Connect" buttons to show.
 */
export async function GET() {
  return NextResponse.json({
    platforms: listAdapters().map((a) => a.meta),
  });
}
