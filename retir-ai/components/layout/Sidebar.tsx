'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';

const navItems = [
  { section: 'Overview', items: [{ label: 'Dashboard', icon: '⬡', href: '/' }] },
  {
    section: 'Planning',
    items: [
      { label: 'Career Journey', icon: '🗺', href: '/career' },
      { label: 'Payout Estimation', icon: '📊', href: '/estimation' },
      { label: 'Retirement Simulation', icon: '🧮', href: '/simulation' },
    ],
  },
  {
    section: 'Protection',
    items: [
      { label: 'Document Vault', icon: '🗄', href: '/vault' },
      { label: 'Legislative Radar', icon: '📡', href: '/radar', badge: '6' },
    ],
  },
  {
    section: 'Family',
    items: [{ label: 'Family Access', icon: '👥', href: '/family' }],
  },
  {
    section: 'Services',
    items: [{ label: 'Expert Consulting', icon: '👤', href: '/services' }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 bottom-0 flex flex-col z-50"
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--navy-2)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base"
            style={{ background: 'var(--gold)', fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
          >
            R
          </div>
          <div>
            <div className="text-base font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
              RetirAI
            </div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              AI-Powered Multi-Country Pension
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2.5 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section}>
            <div
              className="text-[10px] uppercase tracking-widest px-2.5 pt-2 pb-1 mt-2"
              style={{ color: 'var(--text-dim)' }}
            >
              {group.section}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13.5px] transition-all duration-200 no-underline"
                  style={{
                    color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                    background: isActive ? 'var(--gold-dim)' : 'transparent',
                    border: isActive ? '1px solid var(--gold-border)' : '1px solid transparent',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  <span className="text-[15px] w-5 text-center">{item.icon}</span>
                  {item.label}
                  {'badge' in item && item.badge && (
                    <span
                      className="ml-auto text-[9px] font-semibold rounded-[10px] px-1.5 py-[1px]"
                      style={{ background: 'var(--red)', color: 'white' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Theme toggle */}
      <div className="px-4 py-1.5">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] cursor-pointer transition-all duration-200"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--navy-3)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span className="text-sm">{theme === 'dark' ? '☀️' : '🌙'}</span>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Profile */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <Link
          href="/onboarding"
          className="flex items-center gap-2.5 p-2.5 rounded-[10px] cursor-pointer no-underline transition-all duration-200 hover:opacity-80"
          style={{ background: 'var(--navy-3)' }}
        >
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', color: 'var(--navy)' }}
          >
            MK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text)' }}>
              Mats Karlsson
            </div>
            <div className="text-[10.5px]" style={{ color: 'var(--text-dim)' }}>
              🇱🇺 Luxembourg · multi-country career · 3 countries
            </div>
          </div>
          <span className="text-[11px] shrink-0" style={{ color: 'var(--text-dim)' }}>
            {'\u270E'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
