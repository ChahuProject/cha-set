// generate-showcase-data.mjs — Emits typed showcase datasets for React & Qt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..');
const showcaseDir = path.resolve(repoRoot, 'spec', 'showcase');

const changelog = JSON.parse(fs.readFileSync(path.join(showcaseDir, 'changelog.json'), 'utf8'));
const featureCards = JSON.parse(fs.readFileSync(path.join(showcaseDir, 'feature-cards.json'), 'utf8'));
const navigation = JSON.parse(fs.readFileSync(path.join(showcaseDir, 'navigation.json'), 'utf8'));

// React Output
const reactOutDir = path.resolve(repoRoot, 'packages', 'react', 'examples', 'basic', 'src', 'data');
if (!fs.existsSync(reactOutDir)) fs.mkdirSync(reactOutDir, { recursive: true });

const reactCode = `// GENERATED FILE - DO NOT EDIT.
// Source: spec/showcase/*.json via spec/generators/generate-showcase-data.mjs

export interface ChangelogItem {
  id: string;
  version: string;
  date: string;
  category: string;
  summary: string;
}

export interface FeatureCardItem {
  id: string;
  icon: string;
  title: string;
  badge: string;
  desc: string;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  badge?: string;
  desc: string;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export const CHANGELOG_DATA: ChangelogItem[] = ${JSON.stringify(changelog, null, 2)};
export const FEATURE_CARDS_DATA: FeatureCardItem[] = ${JSON.stringify(featureCards, null, 2)};
export const NAVIGATION_DATA: NavCategory[] = ${JSON.stringify(navigation, null, 2)};
`;

fs.writeFileSync(path.join(reactOutDir, 'showcaseData.generated.ts'), reactCode, 'utf8');

// Qt QML Singleton Output
const qtOutDir = path.resolve(repoRoot, 'qt', 'src');
const qtQml = `pragma Singleton
import QtQuick 6.10

// GENERATED FILE - DO NOT EDIT.
// Source: spec/showcase/*.json via spec/generators/generate-showcase-data.mjs
QtObject {
    id: root

    readonly property var changelog: ${JSON.stringify(changelog)}
    readonly property var featureCards: ${JSON.stringify(featureCards)}
    readonly property var navigation: ${JSON.stringify(navigation)}
}
`;

fs.writeFileSync(path.join(qtOutDir, 'ShowcaseData.generated.qml'), qtQml, 'utf8');

console.log('[gen:showcase] Emitted showcaseData.generated.ts and ShowcaseData.generated.qml');
