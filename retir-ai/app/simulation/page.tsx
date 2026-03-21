'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { SimulationControls } from '@/components/simulation/SimulationControls';
import { TaxBreakdownTable } from '@/components/simulation/TaxBreakdownTable';
import { CountryComparison } from '@/components/simulation/CountryComparison';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { simulateResidence, buildPensionSources } from '@/lib/tax';
import type { ResidenceCountry } from '@/lib/tax';

export default function SimulationPage() {
  const [retirementAge, setRetirementAge] = useState(64);
  const [selectedResidences, setSelectedResidences] = useState<ResidenceCountry[]>(['FR', 'PT', 'IT']);

  const toggleResidence = (country: ResidenceCountry) => {
    setSelectedResidences((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country],
    );
  };

  const results = useMemo(() => {
    const sources = buildPensionSources(retirementAge);
    return selectedResidences.map((country) => simulateResidence(sources, country));
  }, [retirementAge, selectedResidences]);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
          <Topbar
            title="Retirement Simulation"
            subtitle="When & where — compare net income after taxes"
            actions={
              <Button variant="ghost">📤 Export comparison</Button>
            }
          />
          <div className="flex-1 p-7 animate-fade-in">
            <SimulationControls
              retirementAge={retirementAge}
              onRetirementAgeChange={setRetirementAge}
              selectedResidences={selectedResidences}
              onToggleResidence={toggleResidence}
            />
            {results.length > 0 && <TaxBreakdownTable results={results} />}
            {results.length > 0 && <CountryComparison results={results} />}

            {/* Expert CTA */}
            <div
              className="mt-5 rounded-[14px] p-5 flex items-center justify-between"
              style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}
            >
              <div>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--gold-light)' }}>
                  Need help choosing the best retirement country?
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Our tax experts can run a detailed analysis for your specific multi-country pension mix, including double taxation treaties.
                </div>
              </div>
              <Link href="/services" className="no-underline shrink-0 ml-4">
                <Button variant="outline-gold">👤 Get Expert Analysis</Button>
              </Link>
            </div>
          </div>
        </div>
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}
