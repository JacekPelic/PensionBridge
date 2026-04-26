'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { Button } from '@/shared/ui/Button';
import { PictureSurface } from '@/modules/identity/components/onboarding-v2/PictureSurface';
import { usePicture } from '@/modules/identity/PictureProvider';

function PictureChrome() {
  const { mode, picture, startFresh, loadMock } = usePicture();

  const hasOpening = picture.residenceCountry != null && picture.age != null;
  const countryCount = hasOpening
    ? 1 + (picture.countriesWorked?.length ?? 0)
    : 0;

  let subtitle: string;
  if (mode === 'mock') {
    subtitle = 'Demo \u00B7 Mats Karlsson, 45, LU resident, 3 countries';
  } else if (hasOpening) {
    subtitle = `${countryCount} ${countryCount === 1 ? 'country' : 'countries'} \u00B7 keep adding details to tighten the range`;
  } else {
    subtitle = 'A few questions to get you started \u2014 about 2 minutes';
  }

  return (
    <Topbar
      title="Your pension picture"
      subtitle={subtitle}
      actions={
        mode === 'mock' ? (
          <Button variant="ghost" onClick={startFresh}>
            Start fresh
          </Button>
        ) : (
          <Button variant="ghost" onClick={loadMock}>
            View demo
          </Button>
        )
      }
    />
  );
}

export default function PicturePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <PictureChrome />
        <div className="flex-1 p-7 animate-fade-in">
          <PictureSurface />
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}
