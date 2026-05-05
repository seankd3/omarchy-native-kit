export type IntegrationCatalogEntry = {
  name: string;
  status: 'experimental' | 'stable';
  command: string;
  description: string;
  writesOnlyRequestedPaths: boolean;
};

export type IntegrationCatalog = {
  schemaVersion: 1;
  integrations: IntegrationCatalogEntry[];
};

const integrationCatalog: IntegrationCatalog = {
  schemaVersion: 1,
  integrations: [
    {
      name: 'darktable',
      status: 'experimental',
      command: 'omarchy-native integrate darktable --out ~/.config/darktable/themes/omarchy.css',
      description: 'Generate an opt-in darktable CSS theme from Omarchy semantic tokens while preserving neutral photo surfaces.',
      writesOnlyRequestedPaths: true
    }
  ]
};

export function readIntegrationCatalog(): IntegrationCatalog {
  return {
    schemaVersion: integrationCatalog.schemaVersion,
    integrations: integrationCatalog.integrations.map((entry) => ({ ...entry }))
  };
}

export function toIntegrationCatalogJson(catalog: IntegrationCatalog = readIntegrationCatalog()): string {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

export function toIntegrationCatalogText(catalog: IntegrationCatalog = readIntegrationCatalog()): string {
  const lines = ['Omarchy Native Kit integrations'];
  for (const integration of catalog.integrations) {
    lines.push(`- ${integration.name} (${integration.status})`);
    lines.push(`  ${integration.description}`);
    lines.push(`  Command: ${integration.command}`);
    lines.push(`  Safety: ${integration.writesOnlyRequestedPaths ? 'writes only requested paths' : 'may write default app paths'}`);
  }
  return `${lines.join('\n')}\n`;
}
