import React from 'react';
import { useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import ColorsSection from '../../sections/ColorsSection';
import TypeRadiusSection from '../../sections/TypeRadiusSection';

export interface TokensPageProps {
  themeKey: string;
}

export function TokensPage({ themeKey }: TokensPageProps) {
  const { t } = useChaSetI18n();
  return (
    <DocLayout
      category="Get Started"
      title="Theme & Tokens"
      description={t('components.theme-tokens.description', 'Neutral token system driving both Tailwind custom CSS properties and Qt Quick C++ / QML singletons.')}
      tocItems={[
        { id: 'colors', title: t('showcase.toc.colors', 'Color Palette') },
        { id: 'type', title: t('showcase.toc.type', 'Typography & Radius') },
      ]}
    >
      <div className="space-y-12">
        <ColorsSection themeKey={themeKey} />
        <TypeRadiusSection />
      </div>
    </DocLayout>
  );
}
