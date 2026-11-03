import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepTimeline } from './StepTimeline';
import type { PipelineStep } from './types';

describe('StepTimeline (React)', () => {
  const sampleSteps: PipelineStep[] = [
    { name: 'Lint & Typecheck', status: 'success', durationMs: 1450 },
    { name: 'Compile Bundle', status: 'running', durationMs: null },
    { name: 'Integration Tests', status: 'queued', durationMs: null },
    { name: 'Deploy Canary', status: 'failure', durationMs: 820 },
    { name: 'Smoke Verification', status: 'cancelled', durationMs: null },
  ];

  it('renders all step names in sequential timeline order', () => {
    render(<StepTimeline steps={sampleSteps} />);

    expect(screen.getByText('Lint & Typecheck')).toBeInTheDocument();
    expect(screen.getByText('Compile Bundle')).toBeInTheDocument();
    expect(screen.getByText('Integration Tests')).toBeInTheDocument();
    expect(screen.getByText('Deploy Canary')).toBeInTheDocument();
    expect(screen.getByText('Smoke Verification')).toBeInTheDocument();
  });

  it('formats step duration into readable time format', () => {
    render(<StepTimeline steps={sampleSteps} />);

    // 1450ms -> 00:01
    expect(screen.getByText('00:01')).toBeInTheDocument();
    // 820ms -> 00:00
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('renders default empty text when steps list is empty', () => {
    render(<StepTimeline steps={[]} />);
    expect(screen.getByText('No steps')).toBeInTheDocument();
  });

  it('renders custom empty text when provided', () => {
    render(<StepTimeline steps={[]} emptyText="No active workflow steps" />);
    expect(screen.getByText('No active workflow steps')).toBeInTheDocument();
  });
});
