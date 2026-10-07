/** Claude supports both standalone usage settings and an in-app settings dialog. */
export function isUsagePageUrl(href: string): boolean {
  try {
    const url = new URL(href);
    if (url.hostname !== 'claude.ai') return false;

    return /^\/settings\/usage\/?$/.test(url.pathname) ||
      /^#\/?settings\/usage\/?$/.test(url.hash.split('?')[0]);
  } catch {
    return false;
  }
}

export function isUsagePage(): boolean {
  return typeof window !== 'undefined' && isUsagePageUrl(window.location.href);
}
