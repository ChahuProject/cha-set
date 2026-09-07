import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { splitFixedFooter, 拆底部固定区 } from './splitFixedFooter';

function FooterComponent({ children }: { children?: React.ReactNode }) {
  return <div data-slot="dialog-footer">{children}</div>;
}

describe('splitFixedFooter', () => {
  it('extracts footer element and separates other children with keys', () => {
    const elements = (
      <>
        <h1>Title</h1>
        <p>Paragraph 1</p>
        <FooterComponent>Footer content</FooterComponent>
      </>
    );

    const { content, fixedFooter, 内容, 底部固定区 } = splitFixedFooter(
      elements.props.children,
      FooterComponent,
    );

    expect(content).toHaveLength(2);
    expect(fixedFooter).not.toBeNull();
    expect(React.isValidElement(fixedFooter)).toBe(true);
    expect((fixedFooter as React.ReactElement<any>).type).toBe(FooterComponent);

    // Bilingual aliases match
    expect(内容).toBe(content);
    expect(底部固定区).toBe(fixedFooter);
  });

  it('handles children without footer gracefully', () => {
    const elements = (
      <>
        <div>Only content</div>
        <span>Another node</span>
      </>
    );

    const { content, fixedFooter } = splitFixedFooter(elements.props.children, FooterComponent);
    expect(content).toHaveLength(2);
    expect(fixedFooter).toBeNull();
  });

  it('supports 拆底部固定区 alias', () => {
    expect(拆底部固定区).toBe(splitFixedFooter);
  });
});
