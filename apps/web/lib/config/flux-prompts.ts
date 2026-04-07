/**
 * Flux image generation prompts for each context in the platform.
 */

// ---------------------------------------------------------------------------
// Feature 1 — Certificate backgrounds by material category
// ---------------------------------------------------------------------------

export const CERTIFICATE_PROMPTS: Record<string, string> = {
  plastics:
    'Abstract artistic background, recycled plastic texture, translucent layers of blue and green polymer, ' +
    'light refracting through compressed plastic sheets, industrial recycling aesthetic, ' +
    'clean minimal composition, soft gradient, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  metals:
    'Abstract artistic background, recycled metal texture, brushed aluminum and copper tones, ' +
    'metallic reflections, industrial forge aesthetic, molten metal streams, ' +
    'clean minimal composition, warm industrial tones, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  paper_cardboard:
    'Abstract artistic background, recycled paper and cardboard texture, layered kraft paper, ' +
    'warm beige and brown tones, pressed cardboard fibers visible, ' +
    'eco-friendly organic feel, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  textiles:
    'Abstract artistic background, recycled textile fibers, woven fabric close-up, ' +
    'colorful thread patterns, cotton and polyester blend textures, ' +
    'warm tones, sustainable fashion aesthetic, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  wood:
    'Abstract artistic background, recycled wood texture, reclaimed timber grain patterns, ' +
    'warm oak and pine tones, wood chips and sawdust artistic composition, ' +
    'natural organic aesthetic, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  glass:
    'Abstract artistic background, recycled glass texture, crushed glass particles, ' +
    'light refracting through green and clear glass shards, ' +
    'translucent layers, clean minimal composition, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  electronics:
    'Abstract artistic background, recycled electronics, circuit board patterns, ' +
    'green PCB traces, copper wiring, microchip aesthetic, ' +
    'tech recycling composition, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  construction:
    'Abstract artistic background, recycled construction materials, concrete and brick textures, ' +
    'aggregate patterns, urban industrial aesthetic, ' +
    'grey and terracotta tones, professional certificate background, ' +
    'no text no letters no words, 4k quality',

  biodegradable:
    'Abstract artistic background, organic compost texture, rich dark soil, ' +
    'green sprouts emerging, natural decomposition beauty, ' +
    'earth tones, life cycle aesthetic, professional certificate background, ' +
    'no text no letters no words, 4k quality',
};

// ---------------------------------------------------------------------------
// Feature 2 — Comptoir listing product images
// ---------------------------------------------------------------------------

const LISTING_CATEGORY_STYLES: Record<string, string> = {
  plastics:
    'pile of sorted recycled plastic materials, various colors, industrial bales, ',
  metals:
    'sorted scrap metal pieces, aluminum and steel, industrial recycling yard, ',
  paper_cardboard:
    'stacked recycled cardboard bales, kraft paper rolls, ',
  textiles:
    'sorted recycled textile bundles, fabric rolls, various colors, ',
  wood: 'reclaimed wood pallets, timber planks, clean stacked, ',
  glass:
    'sorted recycled glass cullet, clear and colored glass, ',
  electronics:
    'sorted electronic components, circuit boards, clean arrangement, ',
  construction:
    'recycled construction aggregates, concrete blocks, sorted materials, ',
  biodegradable:
    'organic waste ready for composting, food scraps, green bin, ',
};

export function buildListingPrompt(
  category: string,
  description: string,
): string {
  const base =
    'Professional product photography, clean white background, studio lighting, ';
  const style = LISTING_CATEGORY_STYLES[category] ?? '';
  // Sanitize user input: strip special chars, limit length
  const sanitized = description
    .replace(/[^\w\s,.\-àâäéèêëïîôùûüÿçœæ]/gi, '')
    .slice(0, 200);
  const keywords = sanitized.split(/\s+/).slice(0, 20).join(' ');

  return (
    base +
    style +
    `${keywords}, ` +
    'realistic, high quality, 4k, no text no letters no words'
  );
}

// ---------------------------------------------------------------------------
// Feature 3 — ESG report section illustrations
// ---------------------------------------------------------------------------

export const REPORT_SECTION_PROMPTS: Record<string, string> = {
  environment:
    'Lush green landscape with modern sustainable factory, solar panels on roof, ' +
    'wind turbines in background, clear blue sky, birds flying, ' +
    'photorealistic, wide angle, professional corporate report illustration, ' +
    'no text no letters no words, 16:9 aspect ratio',

  social:
    'Diverse team of professionals collaborating in modern bright office, ' +
    'inclusive workplace, natural light, plants, teamwork, ' +
    'photorealistic, warm tones, professional corporate report illustration, ' +
    'no text no letters no words, 16:9 aspect ratio',

  governance:
    'Modern boardroom with glass walls, city skyline view, ' +
    'professional meeting table, transparency and trust aesthetic, ' +
    'photorealistic, clean lines, professional corporate report illustration, ' +
    'no text no letters no words, 16:9 aspect ratio',

  circular_economy:
    'Circular economy concept, recycling loop visualization, ' +
    'materials being transformed and reused, green and blue tones, ' +
    'sustainable industry, photorealistic, professional corporate report illustration, ' +
    'no text no letters no words, 16:9 aspect ratio',

  carbon:
    'Carbon footprint reduction concept, green city with clean air, ' +
    'transition from industrial pollution to clean energy, ' +
    'before and after split composition, photorealistic, professional corporate report illustration, ' +
    'no text no letters no words, 16:9 aspect ratio',
};

// ---------------------------------------------------------------------------
// Feature 4 — Enterprise white-label branded visuals
// ---------------------------------------------------------------------------

export function buildBrandedPrompt(
  basePrompt: string,
  brandColors: { primary: string; secondary: string },
  industry: string,
): string {
  return (
    basePrompt +
    `, color palette dominated by ${brandColors.primary} and ${brandColors.secondary}, ` +
    `${industry} industry aesthetic, ` +
    'premium corporate branding, elegant, sophisticated, ' +
    'no text no letters no logos no words'
  );
}
