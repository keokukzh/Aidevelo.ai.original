'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    // console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong.</h2>
      {error?.message ? <p style={{ color: '#aaa' }}>{error.message}</p> : null}
      <button onClick={() => reset()} style={{ marginTop: 12 }}>Try again</button>
    </div>
  );
}


