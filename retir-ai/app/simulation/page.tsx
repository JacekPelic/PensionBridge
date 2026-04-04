'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { SimulationControls } from '@/modules/tax/components/SimulationControls';
import { TaxBreakdownTable } from '@/modules/tax/components/TaxBreakdownTable';
import { CountryComparison } from '@/modules/tax/components/CountryComparison';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { Button } from '@/shared/ui/Button';
import { simulateResidence, buildPensionSources } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';

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

          </div>
        </div>
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}
