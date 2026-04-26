/**
 * Seed messages for the "Stuck? Ask your advisor" CTA on each ask.
 *
 * The seed is auto-sent to the ChatWidget as a user message, so it must
 * contain enough keywords that `detectIntent` in chatEngine.ts lands on a
 * useful intent. Each ask gets a specific prompt tailored to its common
 * "I can't do this" failure mode.
 */
export function stuckPromptFor(askId: string): string {
  return STUCK_PROMPTS[askId] ?? DEFAULT_STUCK_PROMPT;
}

const DEFAULT_STUCK_PROMPT =
  'I\u2019m stuck trying to get this document. What are my options?';

const STUCK_PROMPTS: Record<string, string> = {
  // P1 — state
  'ch-ahv':
    'I can\u2019t access my Swiss AHV/AVS career extract. I tried ahv-iv.ch but I\u2019m blocked \u2014 help me work around this.',
  'fr-releve':
    'I can\u2019t access my French Relev\u00e9 de Carri\u00e8re from CNAV. FranceConnect isn\u2019t working for me \u2014 what documents can I use instead?',
  'lu-extrait':
    'I\u2019m having trouble accessing guichet.lu to get my CNAP Extrait de Carri\u00e8re. Help me trace it by post or phone.',

  // P2 — workplace
  'ch-bvg':
    'I can\u2019t find my Swiss Vorsorgeausweis / BVG statement from my former employer. Help me trace my workplace pension.',
  'ch-freizugigkeit':
    'I think I have forgotten Swiss vested benefits (Freiz\u00fcgigkeit) sitting somewhere. zentralstelle.ch returned nothing \u2014 help me locate them.',
  'fr-agirc-arrco':
    'I can\u2019t access my Agirc-Arrco statement. Help me retrieve my French complementary pension data.',
  'lu-rcp':
    'I don\u2019t know who administers my Luxembourg employer pension (RCP). My HR department isn\u2019t responding \u2014 help me identify the provider.',

  // P3 — personal
  'fr-per':
    'I can\u2019t find my French PER statement. I think I have legacy PERP / Madelin plans too \u2014 help me consolidate.',
  'ch-3a':
    'I have multiple Swiss 3a accounts and I\u2019m not sure which ones are still active. Help me gather them.',
  'lu-prevoyance':
    'I need help reviewing my Luxembourg pr\u00e9voyance-vieillesse (Art. 111bis) contract terms given my residency plans.',
  'private-savings':
    'I\u2019m unsure what counts as private savings. Help me estimate the right total.',
};
