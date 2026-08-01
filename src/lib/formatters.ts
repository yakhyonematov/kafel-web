export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    return dateString;
  }
}

// Translate surface types to human-readable strings
export function formatSurface(surface: 'GLOSSY' | 'MATTE' | string): string {
  if (surface === 'GLOSSY') return 'Glyanseviy';
  if (surface === 'MATTE') return 'Matoviy';
  return surface;
}
