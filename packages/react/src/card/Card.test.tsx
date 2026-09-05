import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

describe('Card component', () => {
  it('renders default card container and children', () => {
    render(
      <Card data-testid="card-root">
        <CardHeader>
          <CardTitle>Title Here</CardTitle>
          <CardDescription>Description Here</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );

    const card = screen.getByTestId('card-root');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-slot', 'card');
    expect(card).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText('Title Here')).toBeInTheDocument();
    expect(screen.getByText('Description Here')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('renders variants correctly', () => {
    const { rerender } = render(<Card data-testid="card" variant="secondary" />);
    let card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-variant', 'secondary');
    expect(card.className).toContain('bg-secondary');

    rerender(<Card data-testid="card" variant="outline" />);
    card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-variant', 'outline');
    expect(card.className).toContain('bg-transparent');
  });

  it('merges custom className and forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref} className="custom-test-class" data-testid="card" />);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('custom-test-class');
    expect(ref.current).toBe(card);
  });
});
