import { AnimateOnScroll } from '../../_components/animate-on-scroll';

interface RoadmapItem {
  label: string;
  status: 'done' | 'in_progress' | 'planned';
}

interface RoadmapYear {
  year: string;
  items: RoadmapItem[];
}

const ROADMAP: RoadmapYear[] = [
  {
    year: '2024',
    items: [
      { label: 'ISO 59004, 59010, 59014, 59020 integrees', status: 'done' },
      {
        label: 'CSRD / ESRS obligatoires pour les grandes entreprises',
        status: 'done',
      },
      { label: 'AI Act -- conformite IA integree', status: 'done' },
    ],
  },
  {
    year: '2025',
    items: [
      {
        label: 'Decret 9 flux -- biodechets et textiles ajoutes',
        status: 'done',
      },
      { label: 'REP etendue aux emballages industriels', status: 'done' },
      {
        label: 'Blockchain Polygon -- tracabilite on-chain operationnelle',
        status: 'done',
      },
    ],
  },
  {
    year: '2026',
    items: [
      { label: 'ESRS sectorielles -- anticipation integree', status: 'done' },
      {
        label: 'CSRD etendue aux PME (2026-2028) -- prets',
        status: 'in_progress',
      },
      {
        label: 'ISO 59001 (certification EC) -- suivi actif',
        status: 'in_progress',
      },
    ],
  },
  {
    year: '2027-2030',
    items: [
      { label: 'Extension CSRD aux PME', status: 'planned' },
      {
        label: 'ISO 59040 -- Fiche de circularite des produits',
        status: 'planned',
      },
      {
        label: 'PPWR -- 100% emballages recyclables (2030)',
        status: 'planned',
      },
      { label: 'Label GreenEcoGenius certifie et reconnu', status: 'planned' },
    ],
  },
];

function StatusIcon({ status }: { status: RoadmapItem['status'] }) {
  switch (status) {
    case 'done':
      return <span className="text-emerald-600">&#10003;</span>;
    case 'in_progress':
      return <span className="text-amber-500">&#8635;</span>;
    case 'planned':
      return <span className="text-muted-foreground">&#9723;</span>;
  }
}

export function NormsRoadmap() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Notre feuille de route normative
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-center text-sm">
            GreenEcoGenius anticipe les reglementations a venir pour que vous
            soyez toujours en avance, jamais en retard.
          </p>
        </AnimateOnScroll>

        <div className="mt-10 space-y-8">
          {ROADMAP.map((yearBlock, yi) => (
            <AnimateOnScroll
              key={yearBlock.year}
              animation="fade-up"
              delay={yi * 100}
            >
              <div className="flex gap-6">
                <div className="w-24 shrink-0 text-right">
                  <span className="text-sm font-bold">{yearBlock.year}</span>
                </div>
                <div className="relative flex-1 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
                  <div className="space-y-2">
                    {yearBlock.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-0.5 shrink-0">
                          <StatusIcon status={item.status} />
                        </span>
                        <span
                          className={
                            item.status === 'planned'
                              ? 'text-muted-foreground'
                              : ''
                          }
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
