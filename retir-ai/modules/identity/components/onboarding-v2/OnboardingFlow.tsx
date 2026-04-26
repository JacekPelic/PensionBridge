'use client';

import { PictureSurface } from './PictureSurface';
import { usePicture } from '@/modules/identity/PictureProvider';

/**
 * Full-screen prototype chrome around <PictureSurface />.
 * Used at /picture for the standalone prototype view. The dashboard (/)
 * embeds <PictureSurface /> directly inside the sidebar layout instead.
 */
export function OnboardingFlow() {
  const { mode, startFresh, loadMock } = usePicture();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--navy)' }}
    >
      <header
        className="flex items-center justify-between px-8 py-5 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base"
            style={{
              background: 'var(--gold)',
              color: 'var(--navy)',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            P
          </div>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            Prevista
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full ml-2"
            style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)' }}
          >
            Picture preview {'\u00B7'} v2
          </span>
        </div>
        <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-dim)' }}>
          {mode === 'user' ? (
            <button
              type="button"
              onClick={loadMock}
              className="cursor-pointer transition-colors"
              style={{ color: 'var(--text-dim)' }}
            >
              View demo
            </button>
          ) : (
            <button
              type="button"
              onClick={startFresh}
              className="cursor-pointer transition-colors"
              style={{ color: 'var(--text-dim)' }}
            >
              Start fresh
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1180px] mx-auto">
          <PictureSurface />
        </div>
      </main>

      <footer
        className="px-8 py-3 text-[11px] text-center shrink-0"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-dim)' }}
      >
        Prototype {'\u00B7'} estimates are rough and for UX validation only
      </footer>
    </div>
  );
}
