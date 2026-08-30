import React from 'react';
import { DocLayout } from '../../layout/DocLayout';
import ColorsSection from '../../sections/ColorsSection';
import TypeRadiusSection from '../../sections/TypeRadiusSection';

export interface TokensPageProps {
  themeKey: string;
}

export function TokensPage({ themeKey }: TokensPageProps) {
  return (
    <DocLayout
      category="Get Started"
      title="Theme & Tokens"
      description="Neutral token system driving both Tailwind custom CSS properties and Qt Quick C++ / QML singletons."
      tocItems={[
        { id: 'colors', title: 'Color Palette' },
        { id: 'type', title: 'Typography & Radius' },
      ]}
    >
      <div className="space-y-12">
        <ColorsSection themeKey={themeKey} />
        <TypeRadiusSection />
      </div>
    </DocLayout>
  );
}
