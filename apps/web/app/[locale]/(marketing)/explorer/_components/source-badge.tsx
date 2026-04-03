const SOURCE_CONFIG: Record<
  string,
  { label: string; url: string; className: string }
> = {
  'ADEME/SINOE': {
    label: 'ADEME/SINOE',
    url: 'https://www.sinoe.org/',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'ADEME 2024': {
    label: 'ADEME',
    url: 'https://www.ademe.fr/',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  ADEME: {
    label: 'ADEME',
    url: 'https://www.ademe.fr/',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Federec: {
    label: 'FEDEREC',
    url: 'https://federec.com/',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  'Federec 2024': {
    label: 'FEDEREC',
    url: 'https://federec.com/',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  Eurostat: {
    label: 'Eurostat',
    url: 'https://ec.europa.eu/eurostat',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  EPA: {
    label: 'US EPA',
    url: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

export function SourceBadge({ source }: { source: string }) {
  const config = SOURCE_CONFIG[source] ?? {
    label: source,
    url: '#',
    className: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  return (
    <a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-80 ${config.className}`}
    >
      {config.label}
    </a>
  );
}
