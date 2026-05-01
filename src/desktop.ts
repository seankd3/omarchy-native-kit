import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export type DesktopEntryOptions = {
  appPath: string;
  name?: string;
  exec?: string;
  icon?: string;
  comment?: string;
  terminal?: boolean;
  categories?: string[];
};

export function toDesktopEntry(options: DesktopEntryOptions): string {
  const appPath = resolve(options.appPath);
  const packageName = readPackageName(appPath);
  const name = options.name?.trim() || titleize(packageName);
  const exec = options.exec?.trim() || `npm --prefix ${shellQuote(appPath)} run preview -- --host 127.0.0.1`;
  const icon = options.icon?.trim() || 'applications-graphics';
  const comment = options.comment?.trim() || 'Omarchy-native app generated with Omarchy Native Kit';
  const categories = options.categories && options.categories.length > 0 ? options.categories : ['Utility'];

  return [
    '[Desktop Entry]',
    'Type=Application',
    `Name=${escapeDesktopValue(name)}`,
    `Comment=${escapeDesktopValue(comment)}`,
    `Exec=${exec}`,
    `Icon=${escapeDesktopValue(icon)}`,
    `Terminal=${options.terminal ? 'true' : 'false'}`,
    `Categories=${categories.map(escapeDesktopValue).join(';')};`,
    ''
  ].join('\n');
}

function readPackageName(appPath: string): string {
  try {
    const packageJson = JSON.parse(readFileSync(join(appPath, 'package.json'), 'utf8')) as { name?: string };
    return packageJson.name || 'omarchy-native-app';
  } catch {
    return 'omarchy-native-app';
  }
}

function titleize(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function escapeDesktopValue(value: string): string {
  return value.replace(/\n/g, ' ').replace(/;/g, ',');
}
