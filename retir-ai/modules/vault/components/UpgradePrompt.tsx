'use client';

import { UpgradePrompt as SharedUpgradePrompt } from '@/shared/ui/UpgradePrompt';

interface Props {
  title: string;
  description: string;
  featureCount?: number;
}

export function UpgradePrompt({ title, description, featureCount }: Props) {
  return (
    <SharedUpgradePrompt
      title={title}
      description={description}
      featureCount={featureCount}
      badge="Vault Pro"
    />
  );
}
