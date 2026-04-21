/**
 * Enviro components barrel export.
 *
 * All components in this folder are wrappers around `@kit/ui` primitives,
 * styled with the `enviro-*` tokens defined in `apps/web/styles/theme.css`.
 *
 * They never:
 *   - re-implement logic that already exists in `@kit/ui` or `@kit/*`;
 *   - hard-code user-facing strings (i18n is the caller's responsibility);
 *   - run animations without honouring `prefers-reduced-motion`.
 */

// Animations
export {
  AnimatedCounter,
  FadeInSection,
  MagneticWrapper,
  PageTransition,
  ParallaxContainer,
  StaggerContainer,
  StaggerItem,
  TextReveal,
  useReducedMotionSafe,
} from './animations';

// Primitives
export { EnviroButton, enviroButtonClasses } from './enviro-button';
export {
  EnviroCard,
  EnviroCardBody,
  EnviroCardFooter,
  EnviroCardHeader,
  EnviroCardTitle,
  enviroCardClasses,
} from './enviro-card';
export { EnviroSectionHeader } from './enviro-section-header';

// Shell
export type { EnviroNavbarLink } from './enviro-navbar';
export { EnviroNavbar } from './enviro-navbar';
export type { EnviroFooterLink, EnviroFooterSection } from './enviro-footer';
export { EnviroFooter } from './enviro-footer';
export { EnviroHero } from './enviro-hero';
export { EnviroPageHero } from './enviro-page-hero';

// Content
export type { EnviroStatBlockProps } from './enviro-stats';
export { EnviroStatBlock, EnviroStats } from './enviro-stats';
export type { EnviroTimelineItemProps } from './enviro-timeline';
export { EnviroTimeline, EnviroTimelineItem } from './enviro-timeline';
export type { EnviroComparisonRow } from './enviro-comparison-table';
export { EnviroComparisonTable } from './enviro-comparison-table';
export { EnviroPricingCard } from './enviro-pricing-card';
export type { EnviroFaqItem } from './enviro-faq';
export { EnviroFaq } from './enviro-faq';
export { EnviroBlogCard } from './enviro-blog-card';
export type { EnviroLogoItem } from './enviro-logo-strip';
export { EnviroLogoStrip } from './enviro-logo-strip';
export { EnviroNewsletterCta } from './enviro-newsletter-cta';
