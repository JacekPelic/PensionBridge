'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ServiceCatalog } from '@/components/services/ServiceCatalog';
import { ServiceRequestForm } from '@/components/services/ServiceRequestForm';
import { ServiceRequestTracker } from '@/components/services/ServiceRequestTracker';
import { serviceRequests } from '@/lib/mock-data';
import { Card } from '@/components/ui/Card';
import type { ServicePackage } from '@/lib/types';

function ServicesContent() {
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const active = serviceRequests.filter((r) => r.status === 'in_progress').length;
  const completed = serviceRequests.filter((r) => r.status === 'completed').length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <Topbar
          title="Expert Consulting"
          subtitle="Personalised pension expertise · quote-based · no commitment until you approve"
        />
        <div className="flex-1 p-7 animate-fade-in">
          {/* Hero */}
          <div
            className="rounded-[18px] p-7 pb-6 mb-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--navy-3) 0%, var(--navy-4) 100%)',
              border: '1px solid var(--gold-border)',
            }}
          >
            <div className="absolute rounded-full" style={{ top: -50, right: -50, width: 220, height: 220, background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                👤
              </div>
              <div className="flex-1">
                <div className="text-[17px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>
                  Multi-country pensions are complex. Our experts make them simple.
                </div>
                <div className="text-[13px] leading-relaxed max-w-[580px]" style={{ color: 'var(--text-muted)' }}>
                  RetirAI gives you the data — but some situations need a human expert. Whether it's locating a lost Pillar 2 fund,
                  navigating a cross-border tax treaty, or filing a gap correction in another language, our certified pension
                  specialists handle it for you. Every engagement starts with a tailored quote — you only pay when you approve.
                </div>
              </div>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>Response Time</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>{'<'}24h</div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>quote turnaround</div>
            </Card>
            <Card>
              <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>Expert Rating</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--gold-light)', lineHeight: 1 }}>4.9/5</div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>from 340+ clients</div>
            </Card>
            <Card>
              <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>Active Requests</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--blue)', lineHeight: 1 }}>{active}</div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>currently being worked on</div>
            </Card>
            <Card>
              <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>Completed</div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>{completed}</div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>past engagements</div>
            </Card>
          </div>

          {/* Catalog */}
          <ServiceCatalog onSelect={setSelectedPkg} />

          {/* Request tracker */}
          <div className="mt-6">
            <ServiceRequestTracker />
          </div>
        </div>
      </div>
      <ChatWidget />

      {/* Request form modal */}
      {selectedPkg && !submitted && (
        <ServiceRequestForm
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
          onSubmit={() => { setSubmitted(true); setSelectedPkg(null); }}
        />
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <ThemeProvider>
      <ServicesContent />
    </ThemeProvider>
  );
}
