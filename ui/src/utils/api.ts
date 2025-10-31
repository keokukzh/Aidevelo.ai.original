// Minimal backend API client
// Uses Vite env var VITE_BACKEND_URL or defaults to localhost:8080

const BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8080';

export type BuildResponse = { run_id: string };
export type RunStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED' | string;

export interface RunInfo {
  run_id: string;
  status: RunStatus;
  current_node?: string;
  logs?: string[];
  created_at?: string;
  updated_at?: string;
}

export async function apiBuild(prompt: string, settings?: Record<string, unknown>, requestId?: string): Promise<BuildResponse> {
  const res = await fetch(`${BASE_URL}/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, settings, request_id: requestId })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Build failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function apiGetRun(runId: string): Promise<RunInfo> {
  const res = await fetch(`${BASE_URL}/runs/${encodeURIComponent(runId)}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Get run failed (${res.status}): ${text}`);
  }
  return res.json();
}
