const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Converts a relative image path (e.g., "/uploads/img-xxx.jpg")
 * to a full absolute URL pointing to the backend server.
 * If the URL is already absolute (starts with http), it is returned as-is.
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '/placeholder-tile.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Remove leading slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
}
