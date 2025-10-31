'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h2>Application error</h2>
          {error?.message ? <p style={{ color: '#aaa' }}>{error.message}</p> : null}
          <button onClick={() => reset()} style={{ marginTop: 12 }}>Reload</button>
        </div>
      </body>
    </html>
  );
}


