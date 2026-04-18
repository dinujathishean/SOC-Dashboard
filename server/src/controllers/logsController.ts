import type { Request, Response } from "express";
import { ingestLogs, type LogUploadRow } from "../services/logService.js";
import { parseLogsCsv } from "../utils/csv.js";

function validateRows(rows: LogUploadRow[]) {
  for (const r of rows) {
    if (!r.sourceIp || !r.message) {
      throw new Error("Each log requires sourceIp and message");
    }
  }
}

export async function logsUploadPost(req: Request, res: Response) {
  try {
    const csv = typeof req.body?.csv === "string" ? req.body.csv : null;
    const raw = req.body?.logs;

    let rows: LogUploadRow[];

    if (csv !== null && csv.trim()) {
      rows = parseLogsCsv(csv);
    } else if (Array.isArray(raw) && raw.length > 0) {
      rows = raw as LogUploadRow[];
    } else {
      res.status(400).json({
        error: 'Expected JSON body: { logs: [...] } or { csv: "header,row,..." }',
      });
      return;
    }

    validateRows(rows);
    const result = await ingestLogs(rows);
    res.json(result);
  } catch (e) {
    const msg = String(e);
    if (msg.includes("requires") || msg.includes("CSV") || msg.includes("header")) {
      res.status(400).json({ error: msg });
      return;
    }
    res.status(500).json({ error: msg });
  }
}
