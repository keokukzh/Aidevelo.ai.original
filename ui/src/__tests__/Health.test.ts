import { describe, it, expect } from 'vitest';

describe('/api/health', () => {
  it('returns ok when server is running (dev)', async () => {
    // Skip if not running locally
    const res = await fetch('http://localhost:3000/api/health').catch(() => null);
    if (!res) return; // no assertion if server not running
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data).toHaveProperty('status', 'ok');
  });
});


