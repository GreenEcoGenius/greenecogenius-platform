'use client';

import { useEffect } from 'react';

export function CrispChat() {
  useEffect(() => {
    const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!CRISP_WEBSITE_ID) return;

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
