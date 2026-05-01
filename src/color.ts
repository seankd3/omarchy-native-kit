export type HexColor = `#${string}`;

export function isHexColor(value: string): value is HexColor {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function normalizeHex(value: string): HexColor {
  const trimmed = value.trim();
  if (!isHexColor(trimmed)) {
    throw new Error(`Expected a 6-digit hex color like #1a2b3c, received "${value}".`);
  }

  return trimmed.toLowerCase() as HexColor;
}

export function blend(foreground: string, background: string, amount: number): HexColor {
  const fg = hexToRgb(normalizeHex(foreground));
  const bg = hexToRgb(normalizeHex(background));
  const ratio = clamp(amount, 0, 1);

  return rgbToHex({
    r: Math.round(fg.r * ratio + bg.r * (1 - ratio)),
    g: Math.round(fg.g * ratio + bg.g * (1 - ratio)),
    b: Math.round(fg.b * ratio + bg.b * (1 - ratio))
  });
}

export function contrastRatio(first: string, second: string): number {
  const a = relativeLuminance(normalizeHex(first));
  const b = relativeLuminance(normalizeHex(second));
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

export function readableForeground(
  background: string,
  preferred: string | undefined,
  options: { fallbackLight?: string; fallbackDark?: string; minimumRatio?: number } = {}
): HexColor {
  const bg = normalizeHex(background);
  const minimumRatio = options.minimumRatio ?? 4.5;
  const candidates = [
    preferred,
    options.fallbackLight ?? '#f8fafc',
    options.fallbackDark ?? '#111827',
    '#ffffff',
    '#000000'
  ].filter((value): value is string => Boolean(value));

  let best = normalizeHex(candidates[0] ?? '#ffffff');
  let bestRatio = contrastRatio(bg, best);

  for (const candidate of candidates) {
    const normalized = normalizeHex(candidate);
    const ratio = contrastRatio(bg, normalized);
    if (ratio >= minimumRatio) return normalized;
    if (ratio > bestRatio) {
      best = normalized;
      bestRatio = ratio;
    }
  }

  return best;
}

function hexToRgb(hex: HexColor): { r: number; g: number; b: number } {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}

function rgbToHex(rgb: { r: number; g: number; b: number }): HexColor {
  return `#${toByte(rgb.r)}${toByte(rgb.g)}${toByte(rgb.b)}`;
}

function toByte(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
}

function relativeLuminance(hex: HexColor): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const scaled = channel / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
